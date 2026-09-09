import uuid
from decimal import Decimal
from typing import Sequence

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse, OrderUpdate

router = APIRouter()


# 1. ĐẶT HÀNG MỚI (POST /)
@router.post(
    "/", 
    response_model=OrderResponse, 
    status_code=status.HTTP_201_CREATED, 
    summary="Đặt đơn hàng mới"
)
async def create_order(
    order_in: OrderCreate, 
    db: AsyncSession = Depends(get_db)
) -> Order:
    total_amount = Decimal("0.00")
    order_items_to_create = []

    # Bước A: Duyệt qua từng sản phẩm khách mua và lấy giá thật từ DB
    for item in order_in.items:
        stmt = select(Product).where(Product.id == item.product_id)
        result = await db.execute(stmt)
        product = result.scalar_one_or_none()

        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Sản phẩm với ID '{item.product_id}' không tồn tại!"
            )
        
        if not product.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Sản phẩm '{product.name}' hiện đang tạm ngừng kinh doanh!"
            )

        # Tính tiền
        unit_price = product.price
        subtotal = unit_price * item.quantity
        total_amount += subtotal

        # Lưu thông tin item chờ tạo (không truyền total_price vì DB tự tính GENERATED ALWAYS)
        order_items_to_create.append({
            "product_id": product.id,
            "quantity": item.quantity,
            "unit_price": unit_price,
        })

    # Bước B: Tạo Order chính
    new_order = Order(
        recipient_name=order_in.recipient_name,
        phone_number=order_in.phone_number,
        shipping_address=order_in.shipping_address,
        notes=order_in.notes,
        total_amount=total_amount,
        status=OrderStatus.PENDING,
        payment_status=PaymentStatus.UNPAID
    )
    db.add(new_order)
    await db.flush()  # Lấy new_order.id

    # Bước C: Tạo các OrderItem liên kết với new_order.id
    for item_data in order_items_to_create:
        order_item = OrderItem(
            order_id=new_order.id,
            **item_data
        )
        db.add(order_item)

    await db.commit()
    await db.refresh(new_order)
    return new_order


# 2. LẤY DANH SÁCH ĐƠN HÀNG (GET /)
@router.get(
    "/", 
    response_model=list[OrderResponse], 
    summary="Lấy danh sách đơn hàng"
)
async def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
) -> Sequence[Order]:
    stmt = select(Order).order_by(Order.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()


# 3. LẤY CHI TIẾT ĐƠN HÀNG THEO ID (GET /{id})
@router.get(
    "/{id}", 
    response_model=OrderResponse, 
    summary="Lấy chi tiết đơn hàng theo ID"
)
async def get_order_by_id(
    id: uuid.UUID, 
    db: AsyncSession = Depends(get_db)
) -> Order:
    stmt = select(Order).where(Order.id == id)
    result = await db.execute(stmt)
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng!"
        )
    return order


# 4. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (PATCH /{id})
@router.patch(
    "/{id}", 
    response_model=OrderResponse, 
    summary="Cập nhật trạng thái đơn hàng / thanh toán"
)
async def update_order(
    id: uuid.UUID, 
    order_in: OrderUpdate, 
    db: AsyncSession = Depends(get_db)
) -> Order:
    stmt = select(Order).where(Order.id == id)
    result = await db.execute(stmt)
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng để cập nhật!"
        )

    update_data = order_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(order, field, value)

    await db.commit()
    await db.refresh(order)
    return order
