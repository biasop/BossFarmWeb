from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware #trình duyệt của ReactJS gọi API sang FastAPI 1 cách an toàn
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Hệ thống Backend Website Thương mại Điện tử Bán Phân Bón - Boss Farm",
    version="1.0.0"
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