import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import String, Text, Numeric, Boolean, DateTime, ForeignKey, func, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    # 1. Khóa chính
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, 
        primary_key=True, 
        default=uuid.uuid4
    )

    # 2. Thông tin cơ bản
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    price: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)

    # 3. Thông tin chi tiết phân bón (Text có thể None)
    composition: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    benefits: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    usage_instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    storage_warnings: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # 4. Khóa ngoại liên kết tới bảng users
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, 
        ForeignKey("users.id", ondelete="SET NULL"), 
        nullable=True
    )

    # 5. Trạng thái cờ (Flags)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")

    # 6. Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now()
    )
