from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    approved: bool

class LoginRequest(BaseModel):
    email: str
    password: str

class PostCreate(BaseModel):
    title: str
    content: str
    post_type: str = "announcement"
    user_id: int

class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    post_type: str
    created_at: datetime

class CommentCreate(BaseModel):
    post_id: int
    user_id: int
    content: str

class CommentResponse(BaseModel):
    id: int
    post_id: int
    user_id: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


# class Config:
#         from_attributes = True