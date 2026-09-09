import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255, description="Tên sản phẩm phân bón")
    price: Decimal = Field(..., gt=Decimal("0"), description="Giá bán phải lớn hơn 0")
    thumbnail_url: Optional[str] = Field(None, max_length=500)
    composition: Optional[str] = None
    benefits: Optional[str] = None
    usage_instructions: Optional[str] = None
    storage_warnings: Optional[str] = None
    is_featured: bool = False
    is_active: bool = True

class ProductCreate(ProductBase):
    category_ids: list[uuid.UUID]=  []

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    price: Optional[Decimal] = Field(default=None, gt=Decimal("0"))
    thumbnail_url: Optional[str] = None
    composition: Optional[str] = None
    benefits: Optional[str] = None
    usage_instructions: Optional[str] = None
    storage_warnings: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    category_ids: Optional[list[uuid.UUID]] = None

class ProductResponse(ProductBase):
    id: uuid.UUID
    slug: str
    created_by: Optional[uuid.UUID] = None
    created_at : datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
    # from_attributes = True để làm gì? Mặc định, 
    # Pydantic chỉ đọc được dữ liệu dạng Dictionary (data["name"]). 
    # Nhưng SQLAlchemy lại trả về một đối tượng Python ORM (product.name). 
    # Cấu hình from_attributes=True cho phép Pydantic tự động đọc các thuộc 
    # tính của SQLAlchemy Model và chuyển thành JSON trả về cho Frontend!