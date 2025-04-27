from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Meal Planner"
    
    # Walmart API Settings
    WALMART_API_KEY: Optional[str] = None
    WALMART_API_SECRET: Optional[str] = None
    
    # Database Settings
    DATABASE_URL: str = "sqlite:///./meal_planner.db"
    
    # Security Settings
    SECRET_KEY: str = "your-secret-key-here"  # Change this in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings() 