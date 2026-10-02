import io
import os
import uuid

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from PIL import Image, ImageOps, UnidentifiedImageError
from supabase import create_client, Client

from schema import UploadResponse

load_dotenv()

router = APIRouter(
    prefix="/uploads",
    tags=["uploads"]
)


SUPABASE_URL = (os.getenv("SUPABASE_URL") or "").strip().rstrip("/")
SUPABASE_SECRET_KEY = (os.getenv("SUPABASE_SECRET_KEY") or "").strip()
SUPABASE_BUCKET = (os.getenv("SUPABASE_BUCKET") or "uploads").strip()

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB

MAX_IMAGE_DIMENSION = 1600
JPEG_QUALITY = 82
WEBP_QUALITY = 82

# Pillow format name -> (file extension, content type)
IMAGE_FORMATS = {
    "JPEG": (".jpg", "image/jpeg"),
    "PNG": (".png", "image/png"),
    "WEBP": (".webp", "image/webp"),
    "GIF": (".gif", "image/gif"),
}

_supabase: Client | None = None


def get_supabase() -> Client:

    global _supabase

    if _supabase is None:
        if not SUPABASE_URL or not SUPABASE_SECRET_KEY:
            raise HTTPException(
                status_code=500,
                detail=(
                    "Supabase storage is not configured. Set SUPABASE_URL "
                    "and SUPABASE_SECRET_KEY in the backend .env and restart."
                )
            )

        try:
            _supabase = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)
        except Exception:
            # Old supabase-py versions reject the new sb_secret_... key format
            # with "Invalid API key". Deliberately not echoing the key.
            raise HTTPException(
                status_code=500,
                detail=(
                    "Could not create Supabase client. Check SUPABASE_URL "
                    "and SUPABASE_SECRET_KEY, and make sure supabase-py is "
                    "up to date (pip install -U supabase)."
                )
            )

    return _supabase


def process_image(contents: bytes) -> tuple[bytes, str, str]:

    try:
        img = Image.open(io.BytesIO(contents))
        img_format = img.format
        img.load()
    except (UnidentifiedImageError, Image.DecompressionBombError, OSError):
        raise HTTPException(
            status_code=400,
            detail="That file is not a valid image."
        )

    if img_format not in IMAGE_FORMATS:
        raise HTTPException(
            status_code=400,
            detail="Only image files (jpg, jpeg, png, gif, webp) are allowed."
        )

    extension, content_type = IMAGE_FORMATS[img_format]

    if img_format == "GIF" or getattr(img, "is_animated", False):
        return contents, extension, content_type

    icc_profile = img.info.get("icc_profile")

    # Bake the phone's rotation into the pixels before EXIF is dropped.
    img = ImageOps.exif_transpose(img)

    if img.mode not in ("RGB", "RGBA", "L", "LA"):
        if img.mode == "CMYK":
            icc_profile = None  # a CMYK profile does not describe RGB output
        has_alpha = "transparency" in img.info or img.mode in ("PA", "La")
        img = img.convert("RGBA" if has_alpha else "RGB")

    img.thumbnail(
        (MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION),
        Image.Resampling.LANCZOS
    )

    save_kwargs = {"icc_profile": icc_profile} if icc_profile else {}
    output = io.BytesIO()

    if img_format == "JPEG":
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")
        img.save(
            output, "JPEG",
            quality=JPEG_QUALITY, optimize=True, progressive=True,
            **save_kwargs
        )
    elif img_format == "PNG":
        img.save(output, "PNG", optimize=True, **save_kwargs)
    else:  # WEBP
        img.save(output, "WEBP", quality=WEBP_QUALITY, method=4, **save_kwargs)

    return output.getvalue(), extension, content_type


@router.post("/", response_model=UploadResponse)
async def upload_image(file: UploadFile):
    original_name = file.filename or ""
    original_ext = os.path.splitext(original_name)[1].lower()

    if original_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only image files (jpg, jpeg, png, gif, webp) are allowed."
        )

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail="Image is too large. Max upload size is 25MB."
        )

    # CPU-bound, so run it off the event loop.
    contents, ext, content_type = await run_in_threadpool(
        process_image, contents
    )

    filename = f"{uuid.uuid4().hex}{ext}"

    supabase = get_supabase()

    try:
        supabase.storage.from_(SUPABASE_BUCKET).upload(
            filename,
            contents,
            {"content-type": content_type},
        )
    except Exception as exc:
        message = str(exc)

        if "not found" in message.lower():
            message = (
                f"Storage bucket '{SUPABASE_BUCKET}' not found. Create it in "
                "Supabase Storage and mark it Public."
            )

        raise HTTPException(
            status_code=502,
            detail=f"Could not upload image to storage: {message}"
        )

    public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(filename)

    return UploadResponse(url=public_url)