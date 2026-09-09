from typing import Optional
from pydantic import BaseModel, Field

#DTO login
class LoginRequest(BaseModel):
    username_or_email: str = Field(description="Tên đăng nhập hoặc Email")
    password: str = Field(description="Mật khẩu")

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
class TokenPayload(BaseModel):
    sub: Optional[str] = None #để tạm mỗi id cho đơn giản