from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from database import engine
from model import Post, User
from schema import PostCreate, PostResponse

router = APIRouter(prefix="/posts", tags=["posts"])


@router.post("/", response_model=PostResponse)
def create_post(post: PostCreate):
    with Session(engine) as db:
        user = db.get(User, post.user_id)

        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found."
            )

        if not user.approved:
            raise HTTPException(
                status_code=403,
                detail="Your account is not approved."
            )

        if user.role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Only admins can create posts."
            )

        new_post = Post(
            title=post.title,
            content=post.content,
            post_type=post.post_type
        )

        db.add(new_post)
        db.commit()
        db.refresh(new_post)

        return new_post


@router.get("/", response_model=list[PostResponse])
def get_posts():
    with Session(engine) as db:
        posts = (
            db.query(Post)
            .order_by(Post.created_at.desc())
            .all()
        )

        return posts