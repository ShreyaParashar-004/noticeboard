from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import engine
from model import User
from schema import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate):
    with Session(engine) as db:
        new_user = User(
            name=user.name,
            email=user.email
        )

        db.add(new_user)

        try:
            db.commit()
            db.refresh(new_user)
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=409,
                detail="A user with this email already exists."
            )

        return new_user

@router.get("/", response_model=list[UserResponse])
def get_users():
    with Session(engine) as db:
        users = db.query(User).order_by(User.created_at.desc()).all()
        return users