from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import computed_field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file= ".env",
        env_file_encoding= "utf-8",
        extra= "ignore"
    )

    PROJECT_NAME: str = "BossFarm"
    API_V1_STR: str = "/api/v1"

    POSTGRES_SERVER: str
    POSTGRES_PORT: int 
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    
    SECRET_KEY: str = "tiemdeptraiquaemxinin4"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 1 ngàys

    @computed_field 
    @property  #Cho phép truy cập như thuộc tính bình thường setting.DATABASE_URL
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

settings = Settings()
