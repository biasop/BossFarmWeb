import uuid
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

class CategoryBase(BaseModel):
    name: str = Field(min_length=2, max_length=255, description="Tên danh mục phân bón")
    description: Optional[str] = None
    parent_id: Optional[uuid.UUID] = Field(default=None, description="ID danh mục cha (nếu có)")


class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    description: Optional[str] = None
    parent_id: Optional[uuid.UUID] = None

class CategoryResponse(CategoryBase):
    id: uuid.UUID
    slug: str #không có trong base vì backend sẽ tự sinh, ko thì khổ frontend

    model_config = ConfigDict(from_attributes=True)
