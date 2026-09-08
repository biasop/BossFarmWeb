import uuid
from datetime import datetime
from decimal import Decimal
import enum
from typing import Optional

from sqlalchemy import String, Text, Numeric, Integer, DateTime, ForeignKey, Enum as SQLEnum, func, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

class OrderStatus(str, enum.Enum):
    PENDING = "pending"          # Chờ xác nhận
    CONFIRMED = "confirmed"      # Đã xác nhận
    SHIPPING = "shipping"        # Đang giao hàng
    DELIVERED = "delivered"      # Đã giao thành công
    CANCELLED = "cancelled"      # Đã hủy


class PaymentStatus(str, enum.Enum):
    UNPAID = "unpaid"            # Chưa thanh toán (COD)
    PAID = "paid"                # Đã thanh toán (Chuyển khoản / VNPAY)
    REFUNDED = "refunded"        # Đã hoàn tiền


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    
    # Khóa ngoại user_id (Khách vãng lai mua hàng không cần đăng nhập có thể để None)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, 
        ForeignKey("users.id", ondelete="SET NULL"), 
        nullable=True
    )

    recipient_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(20), nullable=False)
    shipping_address: Mapped[str] = mapped_column(Text, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    total_amount: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    
    status: Mapped[OrderStatus] = mapped_column(
        SQLEnum(OrderStatus, name="order_status"), 
        default=OrderStatus.PENDING, 
        server_default=OrderStatus.PENDING.value
    )
    payment_status: Mapped[PaymentStatus] = mapped_column(
        SQLEnum(PaymentStatus, name="payment_status"), 
        default=PaymentStatus.UNPAID, 
        server_default=PaymentStatus.UNPAID.value
    )

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now()
    )

class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    order_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, 
        ForeignKey("orders.id", ondelete="CASCADE"), 
        nullable=False
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, 
        ForeignKey("products.id", ondelete="RESTRICT"), 
        nullable=False
    )
    quantity: Mapped[int] = mapped_column(Integer,nullable = False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(15,2), nullable = False)
    total_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(15,2), nullable=True)