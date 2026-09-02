from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from database import engine
from model import LinkItem, CircleMember
from schema import LinkCreate, LinkResponse

router = APIRouter(
    prefix="/links",
    tags=["links"]
)


@router.post("/", response_model=LinkResponse)
def create_link(item: LinkCreate):
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

        new_link = LinkItem(
            circle_id=item.circle_id,
            user_id=item.user_id,
            title=item.title,
            url=item.url,
            platform=item.platform
        )

        db.add(new_link)
        db.commit()
        db.refresh(new_link)

        return new_link


@router.get("/{circle_id}", response_model=list[LinkResponse])
def get_links(circle_id: int, user_id: int):
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
            db.query(LinkItem)
            .filter(LinkItem.circle_id == circle_id)
            .order_by(LinkItem.created_at.desc())
            .all()
        )


@router.delete("/{link_id}")
def delete_link(link_id: int, user_id: int):
    with Session(engine) as db:
        link = db.get(LinkItem, link_id)

        if link is None:
            raise HTTPException(
                status_code=404,
                detail="Link not found."
            )

        member = (
            db.query(CircleMember)
            .filter(
                CircleMember.circle_id == link.circle_id,
                CircleMember.user_id == user_id,
                CircleMember.approved == True
            )
            .first()
        )

        if member is None or member.role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Only a circle admin can delete links."
            )

        db.delete(link)
        db.commit()

        return {"message": "Link deleted successfully."}
