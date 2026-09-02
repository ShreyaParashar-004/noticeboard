from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from database import engine
from model import PollItem, CircleMember
from schema import PollCreate, PollResponse, PollVote

router = APIRouter(
    prefix="/polls",
    tags=["polls"]
)


@router.post("/", response_model=PollResponse)
def create_poll(item: PollCreate):
    if len(item.options) < 2:
        raise HTTPException(
            status_code=400,
            detail="A poll must have at least 2 options."
        )

    if len(item.options) > 10:
        raise HTTPException(
            status_code=400,
            detail="A poll can have at most 10 options."
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

        poll = PollItem(
            circle_id=item.circle_id,
            user_id=item.user_id,
            question=item.question,
            options=item.options,
            votes={}
        )

        db.add(poll)
        db.commit()
        db.refresh(poll)

        return poll


@router.get("/{circle_id}", response_model=list[PollResponse])
def get_polls(circle_id: int, user_id: int):
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
            db.query(PollItem)
            .filter(PollItem.circle_id == circle_id)
            .order_by(PollItem.created_at.desc())
            .all()
        )


@router.post("/{poll_id}/vote", response_model=PollResponse)
def vote_poll(poll_id: int, vote: PollVote):
    with Session(engine) as db:
        poll = db.get(PollItem, poll_id)

        if poll is None:
            raise HTTPException(
                status_code=404,
                detail="Poll not found."
            )

        member = (
            db.query(CircleMember)
            .filter(
                CircleMember.circle_id == poll.circle_id,
                CircleMember.user_id == vote.user_id,
                CircleMember.approved == True
            )
            .first()
        )

        if member is None:
            raise HTTPException(
                status_code=403,
                detail="You must be an approved member of this circle."
            )

        if vote.option not in poll.options:
            raise HTTPException(
                status_code=400,
                detail="Invalid poll option."
            )

        votes = dict(poll.votes or {})
        votes[str(vote.user_id)] = vote.option
        poll.votes = votes

        db.commit()
        db.refresh(poll)

        return poll


@router.delete("/{poll_id}")
def delete_poll(poll_id: int, user_id: int):
    with Session(engine) as db:
        poll = db.get(PollItem, poll_id)

        if poll is None:
            raise HTTPException(
                status_code=404,
                detail="Poll not found."
            )

        member = (
            db.query(CircleMember)
            .filter(
                CircleMember.circle_id == poll.circle_id,
                CircleMember.user_id == user_id,
                CircleMember.approved == True
            )
            .first()
        )

        if member is None or member.role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Only a circle admin can delete polls."
            )

        db.delete(poll)
        db.commit()

        return {"message": "Poll deleted successfully."}
