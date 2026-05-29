from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.lead import LeadStatus


class StatusHistoryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    old_status: LeadStatus | None
    new_status: LeadStatus
    changed_at: datetime


class LeadBase(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    mobile_number: str = Field(min_length=10, max_length=20)
    email: EmailStr
    source: str = Field(min_length=2, max_length=100)
    status: LeadStatus = LeadStatus.NEW


class LeadCreate(LeadBase):
    pass


class LeadUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    mobile_number: str | None = Field(default=None, min_length=10, max_length=20)
    email: EmailStr | None = None
    source: str | None = Field(default=None, min_length=2, max_length=100)
    status: LeadStatus | None = None


class LeadStatusUpdate(BaseModel):
    status: LeadStatus


class LeadRead(LeadBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    status_history: list[StatusHistoryRead] = []


class LeadListResponse(BaseModel):
    items: list[LeadRead]
    total: int
    page: int
    limit: int


class LeadFilters(BaseModel):
    search: str | None = None
    mobile: str | None = None
    status: LeadStatus | None = None
    created_from: date | None = None
    created_to: date | None = None
    page: int = 1
    limit: int = 10
