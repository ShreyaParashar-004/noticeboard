
from datetime import datetime

import re
from pydantic import BaseModel, EmailStr, field_validator

_MARKDOWN_LINK = re.compile(r"^\s*\[[^\]]*\]\(\s*<?([^)\s>]+)>?\s*\)\s*$")


def _plain_url(value: str) -> str:
    """Turns '[url](url)' (Markdown link) or '<url>' into a plain 'url'."""
    value = value.strip()
    match = _MARKDOWN_LINK.match(value)
    if match:
        value = match.group(1)
    return value.strip("<>").strip()


class MoodboardCreate(BaseModel):
    circle_id: int
    user_id: int
    title: str
    images: list[str]

    @field_validator("images")
    @classmethod
    def strip_markdown_links(cls, images: list[str]) -> list[str]:
        return [_plain_url(url) for url in images]


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: str
    password: str


class PostCreate(BaseModel):
    title: str
    content: str
    user_id: int
    circle_id: int


class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    circle_id: int
    created_at: datetime

    class Config:
        from_attributes = True


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


class CircleCreate(BaseModel):
    name: str
    description: str | None = None
    user_id: int


class CircleResponse(BaseModel):
    id: int
    name: str
    description: str | None
    created_by: int
    invite_code: str
    created_at: datetime

    class Config:
        from_attributes = True


class JoinCircleRequest(BaseModel):
    user_id: int
    invite_code: str


class CircleMemberResponse(BaseModel):
    id: int
    user_id: int
    circle_id: int
    role: str
    approved: bool
    created_at: datetime

    class Config:
        from_attributes = True


class CircleMemberPublicResponse(BaseModel):
    user_id: int
    name: str
    role: str

    class Config:
        from_attributes = True


class CircleMemberAdminResponse(BaseModel):
    user_id: int
    name: str
    email: EmailStr
    role: str
    approved: bool

    class Config:
        from_attributes = True


class ScrapbookCreate(BaseModel):
    circle_id: int
    user_id: int
    item_type: str
    content_url: str
    caption: str | None = None


class ScrapbookResponse(BaseModel):
    id: int
    circle_id: int
    user_id: int
    item_type: str
    content_url: str
    caption: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class PDFCreate(BaseModel):
    circle_id: int
    user_id: int
    title: str
    pdf_url: str


class PDFResponse(BaseModel):
    id: int
    circle_id: int
    user_id: int
    title: str
    pdf_url: str
    created_at: datetime

    class Config:
        from_attributes = True


class PollCreate(BaseModel):
    circle_id: int
    user_id: int
    question: str
    options: list[str]


class PollResponse(BaseModel):
    id: int
    circle_id: int
    user_id: int
    question: str
    options: list[str]
    votes: dict
    created_at: datetime

    class Config:
        from_attributes = True


class PollVote(BaseModel):
    user_id: int
    option: str


# class MoodboardCreate(BaseModel):
#     circle_id: int
#     user_id: int
#     title: str
#     images: list[str]


class MoodboardResponse(BaseModel):
    id: int
    circle_id: int
    user_id: int
    title: str
    images: list[str]
    created_at: datetime

    class Config:
        from_attributes = True


class LinkCreate(BaseModel):
    circle_id: int
    user_id: int
    title: str
    url: str
    platform: str | None = None
    # "notice" (Board) or "song" (Album). Defaults to "notice" so existing
    # Board/Notice callers keep working unchanged.
    category: str = "notice"


class LinkResponse(BaseModel):
    id: int
    circle_id: int
    user_id: int
    title: str
    url: str
    platform: str | None
    category: str
    created_at: datetime

    class Config:
        from_attributes = True


class UploadResponse(BaseModel):
    url: str