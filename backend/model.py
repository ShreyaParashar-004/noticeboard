# from datetime import datetime

# from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
# from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
# from sqlalchemy.sql import func


# class Base(DeclarativeBase):
#     pass


# class User(Base):
#     __tablename__ = "users"

#     id: Mapped[int] = mapped_column(primary_key=True)

#     name: Mapped[str] = mapped_column(
#         String(100),
#         nullable=False
#     )

#     email: Mapped[str] = mapped_column(
#         String(100),
#         unique=True,
#         nullable=False
#     )

#     created_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         server_default=func.now(),
#         nullable=False
#     )

#     password_hash: Mapped[str] = mapped_column(
#         String(255),
#         nullable=False
#     )


# class Circle(Base):
#     __tablename__ = "circles"

#     id: Mapped[int] = mapped_column(
#         primary_key=True
#     )

#     name: Mapped[str] = mapped_column(
#         String(100),
#         nullable=False
#     )

#     description: Mapped[str | None] = mapped_column(
#         String(500),
#         nullable=True
#     )

#     created_by: Mapped[int] = mapped_column(
#         ForeignKey("users.id"),
#         nullable=False
#     )

#     invite_code: Mapped[str] = mapped_column(
#         String(100),
#         unique=True,
#         nullable=False
#     )

#     created_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         server_default=func.now(),
#         nullable=False
#     )


# class CircleMember(Base):
#     __tablename__ = "circle_members"

#     id: Mapped[int] = mapped_column(
#         primary_key=True
#     )

#     user_id: Mapped[int] = mapped_column(
#         ForeignKey("users.id"),
#         nullable=False
#     )

#     circle_id: Mapped[int] = mapped_column(
#         ForeignKey("circles.id"),
#         nullable=False
#     )

#     role: Mapped[str] = mapped_column(
#         String(20),
#         default="member",
#         nullable=False
#     )

#     approved: Mapped[bool] = mapped_column(
#         Boolean,
#         default=False,
#         nullable=False
#     )

#     created_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         server_default=func.now(),
#         nullable=False
#     )

#     __table_args__ = (
#         UniqueConstraint(
#             "user_id",
#             "circle_id",
#             name="unique_user_circle"
#         ),
#     )


# class ScrapbookItem(Base):
#     __tablename__ = "scrapbook_items"

#     id = Column(Integer, primary_key=True, index=True)
#     circle_id = Column(Integer, nullable=False)
#     user_id = Column(Integer, nullable=False)
#     item_type = Column(String(20), nullable=False)
#     content_url = Column(String(2000), nullable=False)
#     caption = Column(String(1000), nullable=True)
#     created_at = Column(DateTime, default=datetime.utcnow)


# class Post(Base):
#     __tablename__ = "posts"

#     id: Mapped[int] = mapped_column(
#         primary_key=True
#     )

#     circle_id: Mapped[int] = mapped_column(
#         ForeignKey("circles.id"),
#         nullable=False
#     )

#     title: Mapped[str] = mapped_column(
#         String(200),
#         nullable=False
#     )

#     content: Mapped[str] = mapped_column(
#         String(5000),
#         nullable=False
#     )

#     created_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         server_default=func.now(),
#         nullable=False
#     )


# class Comment(Base):
#     __tablename__ = "comments"

#     id: Mapped[int] = mapped_column(
#         primary_key=True
#     )

#     post_id: Mapped[int] = mapped_column(
#         ForeignKey("posts.id"),
#         nullable=False
#     )

#     user_id: Mapped[int] = mapped_column(
#         ForeignKey("users.id"),
#         nullable=False
#     )

#     content: Mapped[str] = mapped_column(
#         String(1000),
#         nullable=False
#     )

#     created_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         server_default=func.now(),
#         nullable=False
#     )


# class PDFItem(Base):
#     __tablename__ = "pdf_items"

#     id = Column(Integer, primary_key=True, index=True)
#     circle_id = Column(Integer, nullable=False)
#     user_id = Column(Integer, nullable=False)
#     title = Column(String, nullable=False)
#     pdf_url = Column(String, nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow)


# class PollItem(Base):
#     __tablename__ = "poll_items"

#     id = Column(Integer, primary_key=True, index=True)
#     circle_id = Column(Integer, nullable=False)
#     user_id = Column(Integer, nullable=False)
#     question = Column(String, nullable=False)
#     options = Column(JSON, nullable=False)
#     votes = Column(JSON, nullable=False, default=dict)
#     created_at = Column(DateTime, default=datetime.utcnow)


# class MoodboardItem(Base):
#     __tablename__ = "moodboards"

#     id = Column(Integer, primary_key=True, index=True)
#     circle_id = Column(Integer, nullable=False)
#     user_id = Column(Integer, nullable=False)
#     title = Column(String, nullable=False)
#     images = Column(JSON, nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow)


# class LinkItem(Base):
#     __tablename__ = "links"

#     id = Column(Integer, primary_key=True, index=True)
#     circle_id = Column(Integer, nullable=False)
#     user_id = Column(Integer, nullable=False)
#     title = Column(String, nullable=False)
#     url = Column(String, nullable=False)
#     platform = Column(String, nullable=True)
#     created_at = Column(DateTime, default=datetime.utcnow)








from datetime import datetime
 
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.sql import func
 
 
class Base(DeclarativeBase):
    pass
 
 
class User(Base):
    __tablename__ = "users"
 
    id: Mapped[int] = mapped_column(primary_key=True)
 
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )
 
    email: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )
 
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
 
    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
 
 
class Circle(Base):
    __tablename__ = "circles"
 
    id: Mapped[int] = mapped_column(
        primary_key=True
    )
 
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )
 
    description: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )
 
    created_by: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )
 
    invite_code: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )
 
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
 
 
class CircleMember(Base):
    __tablename__ = "circle_members"
 
    id: Mapped[int] = mapped_column(
        primary_key=True
    )
 
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )
 
    circle_id: Mapped[int] = mapped_column(
        ForeignKey("circles.id"),
        nullable=False
    )
 
    role: Mapped[str] = mapped_column(
        String(20),
        default="member",
        nullable=False
    )
 
    approved: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
 
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
 
    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "circle_id",
            name="unique_user_circle"
        ),
    )
 
 
class ScrapbookItem(Base):
    __tablename__ = "scrapbook_items"
 
    id = Column(Integer, primary_key=True, index=True)
    circle_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    item_type = Column(String(20), nullable=False)
    content_url = Column(String(2000), nullable=False)
    caption = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
 
 
class Post(Base):
    __tablename__ = "posts"
 
    id: Mapped[int] = mapped_column(
        primary_key=True
    )
 
    circle_id: Mapped[int] = mapped_column(
        ForeignKey("circles.id"),
        nullable=False
    )
 
    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )
 
    content: Mapped[str] = mapped_column(
        String(5000),
        nullable=False
    )
 
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
 
 
class Comment(Base):
    __tablename__ = "comments"
 
    id: Mapped[int] = mapped_column(
        primary_key=True
    )
 
    post_id: Mapped[int] = mapped_column(
        ForeignKey("posts.id"),
        nullable=False
    )
 
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )
 
    content: Mapped[str] = mapped_column(
        String(1000),
        nullable=False
    )
 
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
 
 
class PDFItem(Base):
    __tablename__ = "pdf_items"
 
    id = Column(Integer, primary_key=True, index=True)
    circle_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    pdf_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
 
 
class PollItem(Base):
    __tablename__ = "poll_items"
 
    id = Column(Integer, primary_key=True, index=True)
    circle_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    question = Column(String, nullable=False)
    options = Column(JSON, nullable=False)
    votes = Column(JSON, nullable=False, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
 
 
class MoodboardItem(Base):
    __tablename__ = "moodboards"
 
    id = Column(Integer, primary_key=True, index=True)
    circle_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    images = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
 
 
class LinkItem(Base):
    __tablename__ = "links"
 
    id = Column(Integer, primary_key=True, index=True)
    circle_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    platform = Column(String, nullable=True)
    # NEW: distinguishes Board/Notice links from Album song links.
    # Reuses the existing LinkItem/links backend instead of a new model.
    category = Column(String(20), nullable=False, default="notice")
    created_at = Column(DateTime, default=datetime.utcnow)
 
