# from fastapi import APIRouter
# from schema import UserCreate, UserResponse

# router = APIRouter(prefix="/users", tags=["users"])


# @router.post("/", response_model=UserResponse)
# def create_user(user: UserCreate):
#     return user

from fastapi import APIRouter
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
        db.commit()
        db.refresh(new_user)

        return new_user