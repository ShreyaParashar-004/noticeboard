from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from database import engine
from model import Post, Circle, CircleMember
from schema import PostCreate, PostResponse

router = APIRouter(
    prefix="/posts",
    tags=["posts"]
)


# ---------------- CREATE POST ----------------

@router.post("/", response_model=PostResponse)
def create_post(post: PostCreate):
    with Session(engine) as db:

        circle = db.get(Circle, post.circle_id)

        if circle is None:
            raise HTTPException(
                status_code=404,
                detail="Circle not found."
            )

        membership = (
            db.query(CircleMember)
            .filter(
                CircleMember.user_id == post.user_id,
                CircleMember.circle_id == post.circle_id
            )
            .first()
        )

        if membership is None:
            raise HTTPException(
                status_code=403,
                detail="You are not a member of this circle."
            )

        if not membership.approved:
            raise HTTPException(
                status_code=403,
                detail="Your membership has not been approved."
            )

        if membership.role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Only circle admins can create posts."
            )

        new_post = Post(
            title=post.title,
            content=post.content,
            circle_id=post.circle_id
        )

        db.add(new_post)
        db.commit()
        db.refresh(new_post)

        return new_post


# ---------------- GET ALL POSTS ----------------

@router.get("/", response_model=list[PostResponse])
def get_posts():
    with Session(engine) as db:
        posts = (
            db.query(Post)
            .order_by(Post.created_at.desc())
            .all()
        )

        return posts


# ---------------- GET POSTS FOR A CIRCLE ----------------

@router.get("/circle/{circle_id}", response_model=list[PostResponse])
def get_circle_posts(circle_id: int):
    with Session(engine) as db:

        circle = db.get(Circle, circle_id)

        if circle is None:
            raise HTTPException(
                status_code=404,
                detail="Circle not found."
            )

        posts = (
            db.query(Post)
            .filter(Post.circle_id == circle_id)
            .order_by(Post.created_at.desc())
            .all()
        )

        return posts

# ---------------- DELETE POST ----------------
@router.delete("/{post_id}")
def delete_post(post_id: int, user_id: int):
    with Session(engine) as db:

        post = db.get(Post, post_id)

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
                detail="Only circle admins can delete posts."
            )

        db.delete(post)
        db.commit()

        return {
            "message": "Post deleted successfully."
        }