import uuid
from typing import List, Optional, Sequence
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.utils import slugify
from app.models.product import Product
from app.models.category import ProductCategory
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate


router = APIRouter()

@router.post("/", response_model = ProductResponse, status_code=status.HTTP_201_CREATED, summary = "Tạo sản phẩm mới")
async def created_product(product_in: ProductCreate, db: AsyncSession = Depends(get_db)):
    slug = slugify(product_in.name)
    stmt = select(Product).where(Product.slug == slug)
    result = await db.execute(stmt)
    exist = result.scalar_one_or_none()
    if exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Đã có sản phẩm có slug là {slug} tồn tại")

    data = product_in.model_dump(exclude={"category_ids"})
    new_product = Product(**data, slug = slug)

    db.add(new_product)
    await db.flush() # sinh ra id và các trường time, flush xong thì database sinh ra tạm thời và nằm trong phiên làm việc tạm thời (Transaction)
    # Commit xong thì database mới cập nhật hẳn

    if product_in.category_ids:
        for cat_id in product_in.category_ids:
            link = ProductCategory(product_id = new_product.id, category_id = cat_id)
            db.add(link)

    await db.commit() #có flush ngầm nên ko cần flush lại để lưu link
    await db.refresh(new_product)

    return new_product


@router.get("/", response_model=list[ProductResponse], summary="ấy danh sách sản phẩm (Có phân trang & tìm kiếm)")
async def get_products(
    skip: int = Query(0, ge=0, description="Số lượng bản ghi bỏ qua (OFFSET)"),
    limit: int = Query(20, ge=1, le=100, description="Số lượng bản ghi tối đa lấy về (LIMIT)"),
    search: Optional[str] = Query(None, description="Từ khóa tìm kiếm theo tên"),
    is_active: Optional[bool] = Query(None, description="Lọc theo trạng thái kinh doanh"),
    db: AsyncSession = Depends(get_db)
) -> Sequence[Product]:
    stmt = select(Product)
    if search:
        stmt = stmt.where(Product.name.ilike(f"%{search}%"))
    
    if is_active is not None:
        stmt = stmt.where(Product.is_active == is_active)

    stmt = stmt.order_by(Product.created_at.desc()).offset(skip).limit(limit)

    result = await db.execute(stmt)
    products = result.scalars().all()
    return products


@router.get("/{id}", response_model=ProductResponse, summary="Lấy chi tiết sản phẩm theo ID")
async def get_product_by_id(id: uuid.UUID, db: AsyncSession = Depends(get_db)) -> Product:
    stmt = select(Product).where(Product.id == id)
    result = await db.execute(stmt)
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy sản phẩm với ID này!"
        )
    
    return product

@router.patch(
    "/{id}", 
    response_model=ProductResponse, 
    summary="Cập nhật thông tin sản phẩm (Chỉ cập nhật trường được gửi lên)"
)
async def update_product(
    id: uuid.UUID,
    product_in: ProductUpdate,
    db : AsyncSession = Depends(get_db)
) -> Product:
    stmt = select(Product).where(Product.id == id)
    result = await db.execute(stmt)
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy sản phẩm cần cập nhật!"
        )
    
    update_data = product_in.model_dump(exclude_unset=True, exclude={"category_ids"})
    
    if "name" in update_data:
        update_data["slug"] = slugify(update_data["name"])
    
    for field, value in update_data.items():
        setattr(product, field, value)
    
    await db.commit()
    await db.refresh(product)
    return product

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Xoá sản phẩm")
async def delete_product(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(Product).where(Product.id == id)
    result = await db.execute(stmt)
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy sản phẩm cần xoá"
        )

    await db.delete(product)
    await db.commit()
    return None