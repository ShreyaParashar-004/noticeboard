from fastapi import APIRouter
from sqlalchemy.orm import Session

from database import engine
from model import Comment
from schema import CommentCreate, CommentResponse

router = APIRouter(
    prefix="/comments",
    tags=["comments"]
)


@router.post("/", response_model=CommentResponse)
def create_comment(comment: CommentCreate):
    with Session(engine) as db:
        new_comment = Comment(
            post_id=comment.post_id,
            user_id=comment.user_id,
            content=comment.content
        )

        db.add(new_comment)
        db.commit()
        db.refresh(new_comment)

        return new_comment


@router.get("/{post_id}", response_model=list[CommentResponse])
def get_comments(post_id: int):
    with Session(engine) as db:
        comments = (
            db.query(Comment)
            .filter(Comment.post_id == post_id)
            .order_by(Comment.created_at.asc())
            .all()
        )

        return comments