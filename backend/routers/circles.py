from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
import secrets

from database import engine
from model import Circle, CircleMember, User
from schema import (
    CircleCreate,
    CircleResponse,
    JoinCircleRequest,
    CircleMemberResponse,
)


router = APIRouter(
    prefix="/circles",
    tags=["circles"]
)


@router.post("/", response_model=CircleResponse)
def create_circle(circle: CircleCreate):
    with Session(engine) as db:
        user = db.get(User, circle.user_id)

        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found."
            )

        invite_code = secrets.token_urlsafe(16)

        new_circle = Circle(
            name=circle.name,
            description=circle.description,
            created_by=circle.user_id,
            invite_code=invite_code
        )

        db.add(new_circle)
        db.commit()
        db.refresh(new_circle)

        new_member = CircleMember(
            user_id=circle.user_id,
            circle_id=new_circle.id,
            role="admin",
            approved=True
        )

        db.add(new_member)
        db.commit()

        db.refresh(new_circle)

        return new_circle


@router.get("/", response_model=list[CircleResponse])
def get_circles():
    with Session(engine) as db:
        return db.query(Circle).order_by(
            Circle.created_at.desc()
        ).all()


@router.get("/{circle_id}", response_model=CircleResponse)
def get_circle(circle_id: int):
    with Session(engine) as db:
        circle = db.get(Circle, circle_id)

        if circle is None:
            raise HTTPException(
                status_code=404,
                detail="Circle not found."
            )

        return circle


@router.post("/join", response_model=CircleMemberResponse)
def request_to_join(request: JoinCircleRequest):
    with Session(engine) as db:
        user = db.get(User, request.user_id)

        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found."
            )

        circle = (
            db.query(Circle)
            .filter(Circle.invite_code == request.invite_code)
            .first()
        )

        if circle is None:
            raise HTTPException(
                status_code=404,
                detail="Invalid invite code."
            )

        existing_member = (
            db.query(CircleMember)
            .filter(
                CircleMember.user_id == request.user_id,
                CircleMember.circle_id == circle.id
            )
            .first()
        )

        if existing_member is not None:
            if existing_member.approved:
                raise HTTPException(
                    status_code=409,
                    detail="You are already a member of this circle."
                )

            raise HTTPException(
                status_code=409,
                detail="You already have a pending join request."
            )

        new_member = CircleMember(
            user_id=request.user_id,
            circle_id=circle.id,
            role="member",
            approved=False
        )

        db.add(new_member)
        db.commit()
        db.refresh(new_member)

        return new_member


@router.get("/{circle_id}/members")
def get_circle_members(circle_id: int, user_id: int):
    with Session(engine) as db:
        requesting_member = (
            db.query(CircleMember)
            .filter(
                CircleMember.circle_id == circle_id,
                CircleMember.user_id == user_id,
                CircleMember.approved == True
            )
            .first()
        )

        if requesting_member is None:
            raise HTTPException(
                status_code=403,
                detail="You must be an approved member of this circle."
            )

        members = (
            db.query(CircleMember, User)
            .join(User, User.id == CircleMember.user_id)
            .filter(
                CircleMember.circle_id == circle_id,
                CircleMember.approved == True
            )
            .all()
        )

        if requesting_member.role == "admin":
            return [
                {
                    "user_id": member.user_id,
                    "name": user.name,
                    "email": user.email,
                    "role": member.role,
                    "approved": member.approved
                }
                for member, user in members
            ]

        return [
            {
                "user_id": member.user_id,
                "name": user.name,
                "role": member.role
            }
            for member, user in members
        ]



@router.get("/{circle_id}/pending")
def get_pending_requests(circle_id: int, admin_user_id: int):
    with Session(engine) as db:
        admin = (
            db.query(CircleMember)
            .filter(
                CircleMember.circle_id == circle_id,
                CircleMember.user_id == admin_user_id,
                CircleMember.role == "admin",
                CircleMember.approved == True
            )
            .first()
        )

        if admin is None:
            raise HTTPException(
                status_code=403,
                detail="Only a circle admin can view join requests."
            )

        pending = (
            db.query(CircleMember, User)
            .join(User, User.id == CircleMember.user_id)
            .filter(
                CircleMember.circle_id == circle_id,
                CircleMember.approved == False
            )
            .order_by(CircleMember.created_at.asc())
            .all()
        )

        return [
            {
                "id": member.id,
                "user_id": member.user_id,
                "name": user.name,
                "email": user.email
            }
            for member, user in pending
        ]



@router.patch(
    "/{circle_id}/members/{member_id}/approve",
    response_model=CircleMemberResponse
)
def approve_member(
    circle_id: int,
    member_id: int,
    admin_user_id: int
):
    with Session(engine) as db:
        admin = (
            db.query(CircleMember)
            .filter(
                CircleMember.circle_id == circle_id,
                CircleMember.user_id == admin_user_id,
                CircleMember.role == "admin",
                CircleMember.approved == True
            )
            .first()
        )

        if admin is None:
            raise HTTPException(
                status_code=403,
                detail="Only a circle admin can approve members."
            )

        member = (
            db.query(CircleMember)
            .filter(
                CircleMember.id == member_id,
                CircleMember.circle_id == circle_id
            )
            .first()
        )

        if member is None:
            raise HTTPException(
                status_code=404,
                detail="Membership request not found."
            )

        member.approved = True

        db.commit()
        db.refresh(member)

        return member


@router.delete("/{circle_id}/members/{user_id}")
def remove_member(
    circle_id: int,
    user_id: int,
    admin_user_id: int
):
    with Session(engine) as db:
        admin_membership = (
            db.query(CircleMember)
            .filter(
                CircleMember.user_id == admin_user_id,
                CircleMember.circle_id == circle_id,
                CircleMember.approved == True
            )
            .first()
        )

        if admin_membership is None or admin_membership.role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Only circle admins can remove members."
            )

        membership = (
            db.query(CircleMember)
            .filter(
                CircleMember.user_id == user_id,
                CircleMember.circle_id == circle_id
            )
            .first()
        )

        if membership is None:
            raise HTTPException(
                status_code=404,
                detail="User is not a member of this circle."
            )

        if membership.role == "admin":
            raise HTTPException(
                status_code=400,
                detail="Admins cannot be removed from the circle."
            )

        db.delete(membership)
        db.commit()

        return {
            "message": "Member removed successfully."
        }
