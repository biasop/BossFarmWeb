from typing import final
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings
from typing import AsyncGenerator

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,
    future=True
    )

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit = False,
    autoflush=True,
    expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

"""
    Client->>Router: Gửi Request (VD: Thêm phân bón mới)
    Router->>GetDB: Yêu cầu kết nối DB (Depends(get_db))
    GetDB->>Session: Khởi tạo Session riêng cho request này
    
    Note over Router,ORM: Em viết code Python: db.add(new_product)
    
    Router->>Session: await session.commit()
    Session->>ORM: Yêu cầu dịch object Python thành SQL
    ORM-->>Session: Sinh câu lệnh SQL: INSERT INTO products (...) VALUES (...)
    Session->>Engine: Mượn 1 kết nối (Connection) từ Pool
    Engine->>DB: Bắn câu lệnh SQL sang PostgreSQL qua driver asyncpg
    DB-->>Engine: Xác nhận lưu thành công (Commit OK)
    Engine-->>Session: Trả kết quả về
    
    GetDB->>Session: Đóng session (await session.close())
    Session->>Engine: Trả đường ống kết nối về lại Pool
    Router-->>Client: Trả về JSON Response { "status": "success" }



    Sinh lệnh truy vấn là ORM
"""