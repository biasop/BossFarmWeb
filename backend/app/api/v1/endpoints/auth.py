from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.database import get_db
from app.core.security import verify_password, create_access_token, get_password_hash
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import Token
router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary="Đăng ký tài khoản mới")
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> User:
    stmt = select(User).where(
        or_(User.username == user_in.username, User.email == user_in.email)
    )
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tên đăng nhập hoặc email đã tồn tại trong hệ thống!"
        )
    new_user = User(
        **user_in.model_dump(exclude={"password"}),
        password_hash=get_password_hash(user_in.password)
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.post(
    "/login", 
    response_model=Token, 
    summary="Đăng nhập nhận JWT Access Token"
)
async def login(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    stmt = select(User).where(
        or_(User.username == form_data.username, User.email == form_data.username)
    )
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tên đăng nhập hoặc mật khẩu không chính xác!"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tài khoản của bạn đã bị vô hiệu hóa!"
        )
    
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get(
    "/me", 
    response_model=UserResponse, 
    summary="Lấy thông tin tài khoản đang đăng nhập"
)
async def get_me(current_user: User = Depends(get_current_user)) -> User:
    return current_user
    