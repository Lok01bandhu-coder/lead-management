from datetime import datetime, time

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models.lead import Lead
from app.models.status_history import StatusHistory
from app.schemas.lead import LeadCreate, LeadFilters, LeadStatusUpdate, LeadUpdate


def create_lead(db: Session, payload: LeadCreate) -> Lead:
    lead = Lead(**payload.model_dump())
    db.add(lead)
    db.flush()

    history = StatusHistory(
        lead_id=lead.id,
        old_status=None,
        new_status=lead.status,
    )
    db.add(history)

    db.commit()
    db.refresh(lead)
    return lead


def get_lead(db: Session, lead_id: int) -> Lead | None:
    statement = (
        select(Lead)
        .options(selectinload(Lead.status_history))
        .where(Lead.id == lead_id)
    )
    return db.scalar(statement)


def list_leads(db: Session, filters: LeadFilters) -> tuple[list[Lead], int]:
    statement = select(Lead).options(selectinload(Lead.status_history))
    count_statement = select(func.count(Lead.id))

    if filters.search:
        pattern = f"%{filters.search}%"
        statement = statement.where(Lead.name.ilike(pattern))
        count_statement = count_statement.where(Lead.name.ilike(pattern))

    if filters.mobile:
        pattern = f"%{filters.mobile}%"
        statement = statement.where(Lead.mobile_number.ilike(pattern))
        count_statement = count_statement.where(Lead.mobile_number.ilike(pattern))

    if filters.status:
        statement = statement.where(Lead.status == filters.status)
        count_statement = count_statement.where(Lead.status == filters.status)

    if filters.created_from:
        created_from_datetime = datetime.combine(filters.created_from, time.min)
        statement = statement.where(Lead.created_at >= created_from_datetime)
        count_statement = count_statement.where(Lead.created_at >= created_from_datetime)

    if filters.created_to:
        created_to_datetime = datetime.combine(filters.created_to, time.max)
        statement = statement.where(Lead.created_at <= created_to_datetime)
        count_statement = count_statement.where(Lead.created_at <= created_to_datetime)

    offset = (filters.page - 1) * filters.limit
    statement = (
        statement
        .order_by(Lead.created_at.desc())
        .offset(offset)
        .limit(filters.limit)
    )

    items = list(db.scalars(statement).all())
    total = db.scalar(count_statement) or 0
    return items, total


def update_lead(db: Session, lead: Lead, payload: LeadUpdate) -> Lead:
    update_data = payload.model_dump(exclude_unset=True)
    old_status = lead.status

    for field, value in update_data.items():
        setattr(lead, field, value)

    if "status" in update_data and update_data["status"] != old_status:
        history = StatusHistory(
            lead_id=lead.id,
            old_status=old_status,
            new_status=update_data["status"],
        )
        db.add(history)

    db.commit()
    db.refresh(lead)
    return lead


def update_lead_status(db: Session, lead: Lead, payload: LeadStatusUpdate) -> Lead:
    old_status = lead.status

    if payload.status == old_status:
        db.refresh(lead)
        return lead

    lead.status = payload.status

    history = StatusHistory(
        lead_id=lead.id,
        old_status=old_status,
        new_status=payload.status,
    )
    db.add(history)
    db.commit()
    db.refresh(lead)
    return lead


def delete_lead(db: Session, lead: Lead) -> None:
    db.delete(lead)
    db.commit()
