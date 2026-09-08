import uuid
from typing import Optional

from sqlalchemy import String, Text, ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    parent_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, 
        ForeignKey("categories.id", ondelete="SET NULL"), 
        nullable=True
    )


class ProductCategory(Base):
    """Bảng trung gian liên kết Nhiều - Nhiều giữa Product và Category"""
    __tablename__ = "product_categories"

    product_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, 
        ForeignKey("products.id", ondelete="CASCADE"), 
        primary_key=True
    )
    category_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, 
        ForeignKey("categories.id", ondelete="CASCADE"), 
        primary_key=True
    )
