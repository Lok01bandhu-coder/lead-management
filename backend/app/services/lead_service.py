from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.crud.lead import (
    create_lead,
    delete_lead,
    get_lead,
    list_leads,
    update_lead,
    update_lead_status,
)
from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadFilters, LeadStatusUpdate, LeadUpdate


class LeadService:
    @staticmethod
    def _raise_database_error(db: Session, error: Exception) -> None:
        db.rollback()

        if isinstance(error, IntegrityError):
            error_message = str(error.orig).lower()

            if "mobile_number" in error_message:
                detail = "A lead with this mobile number already exists."
            elif "email" in error_message:
                detail = "A lead with this email address already exists."
            else:
                detail = "Lead data violates a database rule."

            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=detail) from error

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected database error occurred while processing the lead.",
        ) from error

    @staticmethod
    def create(db: Session, payload: LeadCreate) -> Lead:
        try:
            return create_lead(db, payload)
        except (IntegrityError, SQLAlchemyError) as error:
            LeadService._raise_database_error(db, error)

    @staticmethod
    def get_or_none(db: Session, lead_id: int) -> Lead | None:
        return get_lead(db, lead_id)

    @staticmethod
    def list(db: Session, filters: LeadFilters):
        return list_leads(db, filters)

    @staticmethod
    def update(db: Session, lead: Lead, payload: LeadUpdate) -> Lead:
        try:
            return update_lead(db, lead, payload)
        except (IntegrityError, SQLAlchemyError) as error:
            LeadService._raise_database_error(db, error)

    @staticmethod
    def update_status(db: Session, lead: Lead, payload: LeadStatusUpdate) -> Lead:
        try:
            return update_lead_status(db, lead, payload)
        except (IntegrityError, SQLAlchemyError) as error:
            LeadService._raise_database_error(db, error)

    @staticmethod
    def delete(db: Session, lead: Lead) -> None:
        try:
            delete_lead(db, lead)
        except SQLAlchemyError as error:
            LeadService._raise_database_error(db, error)
