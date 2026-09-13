from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import computed_field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    PROJECT_NAME: str = "BossFarm"
    API_V1_STR: str = "/api/v1"

    # Hỗ trợ nhận trực tiếp DATABASE_URL từ Cloud (Neon, Supabase, Render, Railway)
    DIRECT_DATABASE_URL: Optional[str] = None

    POSTGRES_SERVER: Optional[str] = "localhost"
    POSTGRES_PORT: Optional[int] = 5432
    POSTGRES_USER: Optional[str] = "postgres"
    POSTGRES_PASSWORD: Optional[str] = "postgres"
    POSTGRES_DB: Optional[str] = "bossfarm"
    
    SECRET_KEY: str = "tiemdeptraiquaemxinin4"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 ngày

    @computed_field
    @property
    def DATABASE_URL(self) -> str:
        # Nếu đã có link direct URL từ Cloud
        if self.DIRECT_DATABASE_URL:
            url = self.DIRECT_DATABASE_URL
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+asyncpg://", 1)
            elif url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            
            # asyncpg không chấp nhận tham số 'sslmode' hay 'channel_binding' của libpq
            # Chuẩn hóa toàn bộ query string thành ?ssl=require
            if "?" in url:
                base_url, _ = url.split("?", 1)
                url = f"{base_url}?ssl=require"
            elif "neon.tech" in url or "supabase" in url:
                url = f"{url}?ssl=require"
            return url

        # Ngược lại tạo từ các biến POSTGRES_*
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

settings = Settings()
