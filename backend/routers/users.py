from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
import bcrypt
from pydantic import BaseModel

from database import engine
from model import User
from schema import UserCreate, UserResponse, LoginRequest

router = APIRouter(prefix="/users", tags=["users"])


# get

@router.get("/", response_model=list[UserResponse])
def get_users():
    with Session(engine) as db:
        users = db.query(User).order_by(User.created_at.desc()).all()
        return users

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

# approval 
@router.patch("/{user_id}/approve", response_model=UserResponse)
def approve_user(user_id: int):
    with Session(engine) as db:
        user = db.get(User, user_id)

        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found."
            )

        user.approved = True
        db.commit()
        db.refresh(user)

        return user


# response
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
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=409,
                detail="A user with this email already exists."
            )

        return new_user
    
# login 

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

        if not existing_user.approved:
            raise HTTPException(
                status_code=403,
                detail="Your account has not been approved yet."
            )

        return {
            "message": "Login successful",
            "user_id": existing_user.id,
            "name": existing_user.name,
            "role": existing_user.role
        }