import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from app.models.order import OrderStatus, PaymentStatus

class OrderItemCreate(BaseModel):
    product_id: uuid.UUID = Field(description="ID của sản phẩm cần mua")
    quantity: int = Field(gt=0, description="Số lượng mua phải lớn hơn 0")

class OrderItemResponse(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    quantity: int
    unit_price: Decimal
    total_price: Optional[Decimal] = None
    model_config = ConfigDict(from_attributes=True)

class OrderBase(BaseModel):
    recipient_name: str = Field(min_length=2, max_length=255, description="Tên người nhận hàng")
    phone_number: str = Field(min_length=9, max_length=20, description="Số điện thoại nhận hàng")
    shipping_address: str = Field(min_length=5, description="Địa chỉ nhận hàng chi tiết")
    notes: Optional[str] = Field(default=None, description="Ghi chú đơn hàng (nếu có)")

class OrderCreate(OrderBase):
    # Đơn hàng bắt buộc phải có danh sách ít nhất 1 món hàng
    items: list[OrderItemCreate] = Field(min_length=1, description="Danh sách sản phẩm đặt mua")

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    payment_status: Optional[PaymentStatus] = None
    notes: Optional[str] = None

class OrderResponse(OrderBase):
    id: uuid.UUID
    user_id: Optional[uuid.UUID] = None
    total_amount: Decimal
    status: OrderStatus
    payment_status: PaymentStatus
    created_at: datetime
    updated_at: datetime

    items: list[OrderItemResponse] = []
    model_config = ConfigDict(from_attributes=True)
