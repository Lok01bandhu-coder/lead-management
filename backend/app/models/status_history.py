from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.lead import LeadStatus


class StatusHistory(Base):
    __tablename__ = "lead_status_history"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    lead_id: Mapped[int] = mapped_column(ForeignKey("leads.id", ondelete="CASCADE"), nullable=False)
    old_status: Mapped[LeadStatus | None] = mapped_column(
        Enum(LeadStatus, name="lead_status"),
        nullable=True,
    )
    new_status: Mapped[LeadStatus] = mapped_column(
        Enum(LeadStatus, name="lead_status"),
        nullable=False,
    )
    changed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    lead = relationship("Lead", back_populates="status_history")

