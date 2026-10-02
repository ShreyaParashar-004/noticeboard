# from fastapi import APIRouter, HTTPException
# from sqlalchemy.orm import Session

# from database import engine
# from model import MoodboardItem, CircleMember
# from schema import MoodboardCreate, MoodboardResponse

# router = APIRouter(
#     prefix="/moodboards",
#     tags=["moodboards"]
# )


# @router.post("/", response_model=MoodboardResponse)
# def create_moodboard(item: MoodboardCreate):
#     image_count = len(item.images)

#     if image_count == 1:
#         raise HTTPException(
#             status_code=400,
#             detail="A single image should be added to the album instead."
#         )

#     if image_count < 2 or image_count > 8:
#         raise HTTPException(
#             status_code=400,
#             detail="A moodboard must contain between 2 and 8 images."
#         )

#     with Session(engine) as db:
#         member = (
#             db.query(CircleMember)
#             .filter(
#                 CircleMember.circle_id == item.circle_id,
#                 CircleMember.user_id == item.user_id,
#                 CircleMember.approved == True
#             )
#             .first()
#         )

#         if member is None:
#             raise HTTPException(
#                 status_code=403,
#                 detail="You must be an approved member of this circle."
#             )

#         moodboard = MoodboardItem(
#             circle_id=item.circle_id,
#             user_id=item.user_id,
#             title=item.title,
#             images=item.images
#         )

#         db.add(moodboard)
#         db.commit()
#         db.refresh(moodboard)

#         return moodboard


# @router.get("/{circle_id}", response_model=list[MoodboardResponse])
# def get_moodboards(circle_id: int, user_id: int):
#     with Session(engine) as db:
#         member = (
#             db.query(CircleMember)
#             .filter(
#                 CircleMember.circle_id == circle_id,
#                 CircleMember.user_id == user_id,
#                 CircleMember.approved == True
#             )
#             .first()
#         )

#         if member is None:
#             raise HTTPException(
#                 status_code=403,
#                 detail="You must be an approved member of this circle."
#             )

#         return (
#             db.query(MoodboardItem)
#             .filter(MoodboardItem.circle_id == circle_id)
#             .order_by(MoodboardItem.created_at.desc())
#             .all()
#         )


# @router.delete("/{moodboard_id}")
# def delete_moodboard(moodboard_id: int, user_id: int):
#     with Session(engine) as db:
#         moodboard = db.get(MoodboardItem, moodboard_id)

#         if moodboard is None:
#             raise HTTPException(
#                 status_code=404,
#                 detail="Moodboard not found."
#             )

#         member = (
#             db.query(CircleMember)
#             .filter(
#                 CircleMember.circle_id == moodboard.circle_id,
#                 CircleMember.user_id == user_id,
#                 CircleMember.approved == True
#             )
#             .first()
#         )

#         if member is None or member.role != "admin":
#             raise HTTPException(
#                 status_code=403,
#                 detail="Only a circle admin can delete moodboards."
#             )

#         db.delete(moodboard)
#         db.commit()

#         return {"message": "Moodboard deleted successfully."}












import logging

from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database import engine
from model import MoodboardItem, CircleMember
from schema import MoodboardCreate, MoodboardResponse

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/moodboards",
    tags=["moodboards"]
)


@router.post("/", response_model=MoodboardResponse)
def create_moodboard(item: MoodboardCreate):
    image_count = len(item.images)

    if image_count == 1:
        raise HTTPException(
            status_code=400,
            detail="A single image should be added to the album instead."
        )

    if image_count < 2 or image_count > 8:
        raise HTTPException(
            status_code=400,
            detail="A moodboard must contain between 2 and 8 images."
        )

    with Session(engine) as db:
        member = (
            db.query(CircleMember)
            .filter(
                CircleMember.circle_id == item.circle_id,
                CircleMember.user_id == item.user_id,
                CircleMember.approved == True
            )
            .first()
        )

        if member is None:
            raise HTTPException(
                status_code=403,
                detail="You must be an approved member of this circle."
            )

        moodboard = MoodboardItem(
            circle_id=item.circle_id,
            user_id=item.user_id,
            title=item.title,
            images=item.images,
            # The existing table still has a NOT NULL legacy `image_url`
            # column from the old single-image design. Keep it filled with
            # the first (cover) image instead of inserting NULL.
            image_url=item.images[0]
        )

        try:
            db.add(moodboard)
            db.commit()
            db.refresh(moodboard)
        except SQLAlchemyError:
            db.rollback()
            logger.exception("Could not save moodboard")
            # A clean JSON error, so the browser shows a real message instead
            # of a generic "Failed to fetch" (unhandled 500s carry no CORS
            # headers, which the browser reports as a network failure).
            raise HTTPException(
                status_code=500,
                detail="Could not save moodboard."
            )

        return moodboard


@router.get("/{circle_id}", response_model=list[MoodboardResponse])
def get_moodboards(circle_id: int, user_id: int):
    with Session(engine) as db:
        member = (
            db.query(CircleMember)
            .filter(
                CircleMember.circle_id == circle_id,
                CircleMember.user_id == user_id,
                CircleMember.approved == True
            )
            .first()
        )

        if member is None:
            raise HTTPException(
                status_code=403,
                detail="You must be an approved member of this circle."
            )

        return (
            db.query(MoodboardItem)
            .filter(MoodboardItem.circle_id == circle_id)
            .order_by(MoodboardItem.created_at.desc())
            .all()
        )


@router.delete("/{moodboard_id}")
def delete_moodboard(moodboard_id: int, user_id: int):
    with Session(engine) as db:
        moodboard = db.get(MoodboardItem, moodboard_id)

        if moodboard is None:
            raise HTTPException(
                status_code=404,
                detail="Moodboard not found."
            )

        member = (
            db.query(CircleMember)
            .filter(
                CircleMember.circle_id == moodboard.circle_id,
                CircleMember.user_id == user_id,
                CircleMember.approved == True
            )
            .first()
        )

        if member is None or member.role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Only a circle admin can delete moodboards."
            )

        db.delete(moodboard)
        db.commit()

        return {"message": "Moodboard deleted successfully."}