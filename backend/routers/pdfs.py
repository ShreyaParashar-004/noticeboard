from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from database import engine
from model import PDFItem, CircleMember
from schema import PDFCreate, PDFResponse

router = APIRouter(
    prefix="/pdfs",
    tags=["pdfs"]
)


@router.post("/", response_model=PDFResponse)
def create_pdf(item: PDFCreate):
    with Session(engine) as db:
        member = (
            db.query(CircleMember)
            .filter(
                CircleMember.circle_id == item.circle_id,
                CircleMember.user_id == item.user_id,
                CircleMember.approved == True
            )
            .first()
        )

        if member is None:
            raise HTTPException(
                status_code=403,
                detail="You must be an approved member of this circle."
            )

        new_pdf = PDFItem(
            circle_id=item.circle_id,
            user_id=item.user_id,
            title=item.title,
            pdf_url=item.pdf_url
        )

        db.add(new_pdf)
        db.commit()
        db.refresh(new_pdf)

        return new_pdf


@router.get("/{circle_id}", response_model=list[PDFResponse])
def get_pdfs(circle_id: int, user_id: int):
    with Session(engine) as db:
        member = (
            db.query(CircleMember)
            .filter(
                CircleMember.circle_id == circle_id,
                CircleMember.user_id == user_id,
                CircleMember.approved == True
            )
            .first()
        )

        if member is None:
            raise HTTPException(
                status_code=403,
                detail="You must be an approved member of this circle."
            )

        return (
            db.query(PDFItem)
            .filter(PDFItem.circle_id == circle_id)
            .order_by(PDFItem.created_at.desc())
            .all()
        )


@router.delete("/{pdf_id}")
def delete_pdf(pdf_id: int, user_id: int):
    with Session(engine) as db:
        pdf = db.get(PDFItem, pdf_id)

        if pdf is None:
            raise HTTPException(
                status_code=404,
                detail="PDF not found."
            )

        member = (
            db.query(CircleMember)
            .filter(
                CircleMember.circle_id == pdf.circle_id,
                CircleMember.user_id == user_id,
                CircleMember.approved == True
            )
            .first()
        )

        if member is None or member.role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Only a circle admin can delete PDFs."
            )

        db.delete(pdf)
        db.commit()

        return {"message": "PDF deleted successfully."}