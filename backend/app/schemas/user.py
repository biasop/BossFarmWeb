import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.user import UserRole

class UserBase(BaseModel):
    username: str = Field(min_length=3, max_length=100, description="Tên đăng nhập")
    email: EmailStr = Field(description="Email hợp lệ")
    full_name: Optional[str] = Field(default=None, max_length=255)
    role: UserRole = UserRole.CUSTOMER
    is_active: bool = True


class UserCreate(UserBase):
    password: str = Field(min_length=8, description="Mật khẩu thô tối thiểu 8 ký tự")


class UserUpdate(BaseModel):
    username: Optional[str] = Field(default=None, min_length=3, max_length=100)
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = Field(default=None, min_length=8)  # Đổi mật khẩu mới nếu muốn
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: uuid.UUID
    created_at: datetime
    last_login_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
