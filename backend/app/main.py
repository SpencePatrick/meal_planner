from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import meal_plans, recipes, walmart
from app.core.config import settings

app = FastAPI(
    title="Meal Planner API",
    description="API for meal planning and Walmart+ integration",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(recipes.router, prefix="/api/recipes", tags=["recipes"])
app.include_router(meal_plans.router, prefix="/api/meal-plans", tags=["meal-plans"])
app.include_router(walmart.router, prefix="/api/walmart", tags=["walmart"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Meal Planner API"} 