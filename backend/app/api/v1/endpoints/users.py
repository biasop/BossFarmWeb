import uuid
from typing import Optional, Sequence

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserUpdate

router = APIRouter()

@router.post(
    "/", 
    response_model=UserResponse, 
    status_code=status.HTTP_201_CREATED, 
    summary="Tạo tài khoản người dùng mới"
)
async def create_user(
    user_in: UserCreate, 
    db: AsyncSession = Depends(get_db)
) -> User:
    stmt = select(User).where(
        or_(User.username == user_in.username, User.email == user_in.email)
    )
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        if existing_user.username == user_in.username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tên đăng nhập (username) này đã có người sử dụng!"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email này đã được đăng ký tài khoản!"
            )

    hashed_password = get_password_hash(user_in.password)

    user_data = user_in.model_dump(exclude={"password"})
    new_user = User(
        **user_data,
        password_hash=hashed_password
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.get(
    "/", 
    response_model=list[UserResponse], 
    summary="Lấy danh sách người dùng (Phân trang)"
)
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
) -> Sequence[User]:
    stmt = select(User).order_by(User.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get(
    "/{id}", 
    response_model=UserResponse, 
    summary="Lấy chi tiết người dùng theo ID"
)
async def get_user_by_id(
    id: uuid.UUID, 
    db: AsyncSession = Depends(get_db)
) -> User:
    stmt = select(User).where(User.id == id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng!"
        )
    return user


@router.patch(
    "/{id}", 
    response_model=UserResponse, 
    summary="Cập nhật thông tin người dùng"
)
async def update_user(
    id: uuid.UUID, 
    user_in: UserUpdate, 
    db: AsyncSession = Depends(get_db)
) -> User:
    stmt = select(User).where(User.id == id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng để cập nhật!"
        )

    update_data = user_in.model_dump(exclude_unset=True)

    if "password" in update_data:
        raw_pwd = update_data.pop("password")
        user.password_hash = get_password_hash(raw_pwd)

    for field, value in update_data.items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return user


@router.delete(
    "/{id}", 
    status_code=status.HTTP_204_NO_CONTENT, 
    summary="Xóa người dùng"
)
async def delete_user(
    id: uuid.UUID, 
    db: AsyncSession = Depends(get_db)
):
    stmt = select(User).where(User.id == id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng để xóa!"
        )

    await db.delete(user)
    await db.commit()
    return None
