from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.logger import logger

from app.core.database import get_db
from app.schemas.lead import (
    LeadCreate,
    LeadFilters,
    LeadListResponse,
    LeadRead,
    LeadStatus,
    LeadStatusUpdate,
    LeadUpdate,
)
from app.services.auth_service import get_current_user
from app.services.lead_service import LeadService
from app.utils.pagination import build_pagination_response

router = APIRouter(
    prefix="/leads",
    tags=["Leads"],
    dependencies=[Depends(get_current_user)],
)


@router.post("", response_model=LeadRead, status_code=status.HTTP_201_CREATED)
def create_lead(payload: LeadCreate, db: Session = Depends(get_db)):
    logger.info(f"Creating lead: {payload.name}")
    return LeadService.create(db, payload)


@router.get("", response_model=LeadListResponse)
def list_all_leads(
    search: str | None = None,
    mobile: str | None = None,
    status_value: LeadStatus | None = Query(default=None, alias="status"),
    created_from: date | None = None,
    created_to: date | None = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    filters = LeadFilters(
        search=search,
        mobile=mobile,
        status=status_value,
        created_from=created_from,
        created_to=created_to,
        page=page,
        limit=limit,
    )
    items, total = LeadService.list(db, filters)
    logger.info("Fetching lead list")
    return build_pagination_response(items, total, page, limit)


@router.get("/{lead_id}", response_model=LeadRead)
def get_lead_details(lead_id: int, db: Session = Depends(get_db)):
    lead = LeadService.get_or_none(db, lead_id)
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    return lead


@router.put("/{lead_id}", response_model=LeadRead)
def update_lead_details(lead_id: int, payload: LeadUpdate, db: Session = Depends(get_db)):
    lead = LeadService.get_or_none(db, lead_id)
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    return LeadService.update(db, lead, payload)


@router.patch("/{lead_id}/status", response_model=LeadRead)
def update_status(lead_id: int, payload: LeadStatusUpdate, db: Session = Depends(get_db)):
    lead = LeadService.get_or_none(db, lead_id)
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    return LeadService.update_status(db, lead, payload)


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead_record(lead_id: int, db: Session = Depends(get_db)):
    lead = LeadService.get_or_none(db, lead_id)
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    LeadService.delete(db, lead)
    return None
