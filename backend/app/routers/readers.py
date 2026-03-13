from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.reader import Reader
from app.schemas.reader import ReaderCreate, ReaderUpdate, ReaderResponse

router = APIRouter(prefix="/readers", tags=["readers"])


@router.get("", response_model=List[ReaderResponse])
def list_readers(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Reader)
    if search:
        q = q.filter(
            Reader.full_name.ilike(f"%{search}%")
            | Reader.class_name.ilike(f"%{search}%")
        )
    return q.offset(skip).limit(limit).all()


@router.get("/{reader_id}", response_model=ReaderResponse)
def get_reader(reader_id: int, db: Session = Depends(get_db)):
    reader = db.query(Reader).filter(Reader.id == reader_id).first()
    if not reader:
        raise HTTPException(status_code=404, detail="Độc giả không tồn tại")
    return reader


@router.post("", response_model=ReaderResponse, status_code=201)
def create_reader(payload: ReaderCreate, db: Session = Depends(get_db)):
    reader = Reader(
        full_name=payload.full_name,
        class_name=payload.class_name,
        date_of_birth=payload.date_of_birth,
        gender=payload.gender,
    )
    db.add(reader)
    db.commit()
    db.refresh(reader)
    return reader


@router.put("/{reader_id}", response_model=ReaderResponse)
def update_reader(
    reader_id: int,
    payload: ReaderUpdate,
    db: Session = Depends(get_db),
):
    reader = db.query(Reader).filter(Reader.id == reader_id).first()
    if not reader:
        raise HTTPException(status_code=404, detail="Độc giả không tồn tại")
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(reader, key, value)
    db.commit()
    db.refresh(reader)
    return reader


@router.delete("/{reader_id}", status_code=204)
def delete_reader(reader_id: int, db: Session = Depends(get_db)):
    reader = db.query(Reader).filter(Reader.id == reader_id).first()
    if not reader:
        raise HTTPException(status_code=404, detail="Độc giả không tồn tại")
    db.delete(reader)
    db.commit()
    return None
