from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from database import engine
from model import ScrapbookItem, CircleMember
from schema import ScrapbookCreate, ScrapbookResponse

router = APIRouter(
    prefix="/scrapbook",
    tags=["scrapbook"]
)


@router.post("/", response_model=ScrapbookResponse)
def create_scrapbook_item(item: ScrapbookCreate):
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

        if item.item_type not in ["photo", "song"]:
            raise HTTPException(
                status_code=400,
                detail="item_type must be 'photo' or 'song'."
            )

        new_item = ScrapbookItem(
            circle_id=item.circle_id,
            user_id=item.user_id,
            item_type=item.item_type,
            content_url=item.content_url,
            caption=item.caption
        )

        db.add(new_item)
        db.commit()
        db.refresh(new_item)

        return new_item


@router.get("/{circle_id}", response_model=list[ScrapbookResponse])
def get_scrapbook(circle_id: int, user_id: int):
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
            db.query(ScrapbookItem)
            .filter(ScrapbookItem.circle_id == circle_id)
            .order_by(ScrapbookItem.created_at.desc())
            .all()
        )


@router.delete("/{item_id}")
def delete_scrapbook_item(item_id: int, user_id: int):
    with Session(engine) as db:
        item = db.get(ScrapbookItem, item_id)

        if item is None:
            raise HTTPException(
                status_code=404,
                detail="Scrapbook item not found."
            )

        member = (
            db.query(CircleMember)
            .filter(
                CircleMember.circle_id == item.circle_id,
                CircleMember.user_id == user_id,
                CircleMember.approved == True
            )
            .first()
        )

        if member is None:
            raise HTTPException(
                status_code=403,
                detail="You are not a member of this circle."
            )

        if member.role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Only a circle admin can delete scrapbook items."
            )

        db.delete(item)
        db.commit()

        return {
            "message": "Scrapbook item deleted successfully."
        }
