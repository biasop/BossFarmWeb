import uuid
from typing import Optional, Sequence

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.utils import slugify
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate

router = APIRouter()

@router.post(
    "/", 
    response_model=CategoryResponse, 
    status_code=status.HTTP_201_CREATED, 
    summary="Tạo danh mục phân bón mới"
)
async def create_category(
    category_in: CategoryCreate, 
    db: AsyncSession = Depends(get_db)
) -> Category:
    slug = slugify(category_in.name)

    # Kiểm tra trùng slug
    stmt = select(Category).where(Category.slug == slug)
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Danh mục có slug '{slug}' đã tồn tại!"
        )

    # Nếu có truyền parent_id -> Kiểm tra danh mục cha có tồn tại không
    if category_in.parent_id:
        parent_stmt = select(Category).where(Category.id == category_in.parent_id)
        parent_res = await db.execute(parent_stmt)
        if not parent_res.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Danh mục cha (parent_id) không tồn tại trong hệ thống!"
            )

    new_category = Category(
        **category_in.model_dump(),
        slug=slug
    )
    db.add(new_category)
    await db.commit()
    await db.refresh(new_category)
    return new_category


@router.get(
    "/", 
    response_model=list[CategoryResponse], 
    summary="Lấy danh sách tất cả danh mục"
)
async def get_categories(db: AsyncSession = Depends(get_db)) -> Sequence[Category]:
    stmt = select(Category).order_by(Category.name.asc())
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get(
    "/{id}", 
    response_model=CategoryResponse, 
    summary="Lấy chi tiết danh mục theo ID"
)
async def get_category_by_id(
    id: uuid.UUID, 
    db: AsyncSession = Depends(get_db)
) -> Category:
    stmt = select(Category).where(Category.id == id)
    result = await db.execute(stmt)
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy danh mục!"
        )
    return category


@router.patch(
    "/{id}", 
    response_model=CategoryResponse, 
    summary="Cập nhật danh mục"
)
async def update_category(
    id: uuid.UUID, 
    category_in: CategoryUpdate, 
    db: AsyncSession = Depends(get_db)
) -> Category:
    stmt = select(Category).where(Category.id == id)
    result = await db.execute(stmt)
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy danh mục để cập nhật!"
        )

    update_data = category_in.model_dump(exclude_unset=True)
    if "name" in update_data:
        update_data["slug"] = slugify(update_data["name"])

    for field, value in update_data.items():
        setattr(category, field, value)

    await db.commit()
    await db.refresh(category)
    return category


@router.delete(
    "/{id}", 
    status_code=status.HTTP_204_NO_CONTENT, 
    summary="Xóa danh mục"
)
async def delete_category(
    id: uuid.UUID, 
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Category).where(Category.id == id)
    result = await db.execute(stmt)
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy danh mục để xóa!"
        )

    await db.delete(category)
    await db.commit()
    return None
