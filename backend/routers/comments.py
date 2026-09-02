from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from database import engine
from model import Comment, Post, CircleMember
from schema import CommentCreate, CommentResponse


router = APIRouter(
    prefix="/comments",
    tags=["comments"]
)


@router.post("/", response_model=CommentResponse)
def create_comment(comment: CommentCreate):
    with Session(engine) as db:
        post = db.get(Post, comment.post_id)

        if post is None:
            raise HTTPException(
                status_code=404,
                detail="Post not found."
            )

        membership = (
            db.query(CircleMember)
            .filter(
                CircleMember.user_id == comment.user_id,
                CircleMember.circle_id == post.circle_id,
                CircleMember.approved == True
            )
            .first()
        )

        if membership is None:
            raise HTTPException(
                status_code=403,
                detail="You are not a member of this circle."
            )

        new_comment = Comment(
            post_id=comment.post_id,
            user_id=comment.user_id,
            content=comment.content
        )

        db.add(new_comment)
        db.commit()
        db.refresh(new_comment)

        return new_comment


@router.get(
    "/post/{post_id}",
    response_model=list[CommentResponse]
)
def get_comments(post_id: int):
    with Session(engine) as db:
        post = db.get(Post, post_id)

        if post is None:
            raise HTTPException(
                status_code=404,
                detail="Post not found."
            )

        return (
            db.query(Comment)
            .filter(Comment.post_id == post_id)
            .order_by(Comment.created_at.asc())
            .all()
        )


@router.delete("/{comment_id}")
def delete_comment(comment_id: int, user_id: int):
    with Session(engine) as db:
        comment = db.get(Comment, comment_id)

        if comment is None:
            raise HTTPException(
                status_code=404,
                detail="Comment not found."
            )

        post = db.get(Post, comment.post_id)

        if post is None:
            raise HTTPException(
                status_code=404,
                detail="Post not found."
            )

        membership = (
            db.query(CircleMember)
            .filter(
                CircleMember.user_id == user_id,
                CircleMember.circle_id == post.circle_id,
                CircleMember.approved == True
            )
            .first()
        )

        if membership is None or membership.role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Only circle admins can delete comments."
            )

        db.delete(comment)
        db.commit()

        return {
            "message": "Comment deleted successfully."
        }
