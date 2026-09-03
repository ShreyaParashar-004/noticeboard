# import os
# import uuid

# from fastapi import APIRouter, HTTPException, UploadFile

# from schema import UploadResponse

# router = APIRouter(
#     prefix="/uploads",
#     tags=["uploads"]
# )

# UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "uploads")
# os.makedirs(UPLOAD_DIR, exist_ok=True)

# ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
# MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


# @router.post("/", response_model=UploadResponse)
# async def upload_image(file: UploadFile):
#     original_name = file.filename or ""
#     ext = os.path.splitext(original_name)[1].lower()

#     if ext not in ALLOWED_EXTENSIONS:
#         raise HTTPException(
#             status_code=400,
#             detail="Only image files (jpg, jpeg, png, gif, webp) are allowed."
#         )

#     contents = await file.read()

#     if len(contents) > MAX_FILE_SIZE_BYTES:
#         raise HTTPException(
#             status_code=400,
#             detail="Image is too large. Max size is 10MB."
#         )

#     filename = f"{uuid.uuid4().hex}{ext}"
#     filepath = os.path.join(UPLOAD_DIR, filename)

#     with open(filepath, "wb") as out_file:
#         out_file.write(contents)

#     return UploadResponse(url=f"/static/uploads/{filename}")

import os
import uuid

from fastapi import APIRouter, HTTPException, UploadFile
from supabase import create_client, Client

from schema import UploadResponse

router = APIRouter(
    prefix="/uploads",
    tags=["uploads"]
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "uploads")

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

_supabase: Client | None = None


def get_supabase() -> Client:
    """Lazily creates the Supabase client so a missing config only breaks
    the /uploads/ route, not the whole app on import."""
    global _supabase

    if _supabase is None:
        if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
            raise HTTPException(
                status_code=500,
                detail=(
                    "Supabase storage is not configured. Set SUPABASE_URL "
                    "and SUPABASE_SERVICE_KEY."
                )
            )

        _supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    return _supabase


@router.post("/", response_model=UploadResponse)
async def upload_image(file: UploadFile):
    original_name = file.filename or ""
    ext = os.path.splitext(original_name)[1].lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only image files (jpg, jpeg, png, gif, webp) are allowed."
        )

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail="Image is too large. Max size is 10MB."
        )

    filename = f"{uuid.uuid4().hex}{ext}"
    content_type = file.content_type or "application/octet-stream"

    supabase = get_supabase()

    try:
        supabase.storage.from_(SUPABASE_BUCKET).upload(
            filename,
            contents,
            {"content-type": content_type},
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Could not upload image to storage: {exc}"
        )

    public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(filename)

    return UploadResponse(url=public_url)