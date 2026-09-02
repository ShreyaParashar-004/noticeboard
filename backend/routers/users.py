from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
import bcrypt

from database import engine
from model import User
from schema import UserCreate, UserResponse, LoginRequest

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[UserResponse])
def get_users():
    with Session(engine) as db:
        return db.query(User).order_by(User.created_at.desc()).all()


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int):
    with Session(engine) as db:
        user = db.get(User, user_id)

        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found."
            )

        return user


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate):
    with Session(engine) as db:
        new_user = User(
            name=user.name,
            email=user.email,
            password_hash=bcrypt.hashpw(
                user.password.encode("utf-8"),
                bcrypt.gensalt()
            ).decode("utf-8")
        )

        db.add(new_user)

        try:
            db.commit()
            db.refresh(new_user)
        except IntegrityError as e:
            db.rollback()
            print("DATABASE ERROR:", e)
            raise HTTPException(
                status_code=409,
                detail=str(e.orig)
            )

        return new_user


@router.post("/login")
def login(user: LoginRequest):
    with Session(engine) as db:
        existing_user = (
            db.query(User)
            .filter(User.email == user.email)
            .first()
        )

        if existing_user is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password."
            )

        if not bcrypt.checkpw(
            user.password.encode("utf-8"),
            existing_user.password_hash.encode("utf-8")
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password."
            )

        return {
            "message": "Login successful",
            "user_id": existing_user.id,
            "name": existing_user.name
        }
