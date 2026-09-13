from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
import app.models  # Nạp các model để Base.metadata nhận diện đủ các bảng
from app.api.v1.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Tự động tạo các bảng nếu chưa có khi server khởi động
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Hệ thống Backend Website Thương mại Điện tử Bán Phân Bón - Boss Farm",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags = ["Health Check"])
async def root():
    return {
        "status": "online",
        "message": f"Chào mừng bạn đến với API {settings.PROJECT_NAME}!",
        "docs": "/docs"
    }