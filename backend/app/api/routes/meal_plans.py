from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import random
from app.db.session import get_db
from app.models.models import MealPlan, Recipe
from app.core.config import settings
from pydantic import BaseModel

class GenerateMealPlanRequest(BaseModel):
    cuisine_type: str

class UpdateStatusRequest(BaseModel):
    status: str

router = APIRouter()

@router.post("/generate")
async def generate_meal_plan(
    cuisine_type: str = Query(None),
    request_body: GenerateMealPlanRequest = None,
    db: Session = Depends(get_db)
):
    """Generate a weekly meal plan based on cuisine type"""
    # Get cuisine type from either query param or request body
    final_cuisine_type = cuisine_type or (request_body.cuisine_type if request_body else None)
    if not final_cuisine_type:
        raise HTTPException(status_code=400, detail="cuisine_type is required")

    # Get available recipes for the cuisine type
    recipes = db.query(Recipe).filter(Recipe.cuisine_type == final_cuisine_type).all()
    if not recipes:
        raise HTTPException(status_code=404, detail=f"No recipes found for cuisine type: {final_cuisine_type}")
    
    # Generate a weekly plan (7 days)
    weekly_plan = []
    for day in range(7):
        # Randomly select a recipe for each day
        daily_recipes = random.sample(recipes, k=1)[0]  # One meal per day for now
        weekly_plan.append({
            "day": day + 1,
            "recipe_id": daily_recipes.id,
            "recipe_name": daily_recipes.name
        })
    
    # Create meal plan in database
    meal_plan = MealPlan(
        week_start_date=datetime.utcnow(),
        recipes=weekly_plan,
        status="pending"
    )
    
    db.add(meal_plan)
    try:
        db.commit()
        db.refresh(meal_plan)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating meal plan: {str(e)}")
    
    return {
        "meal_plan_id": meal_plan.id,
        "week_start_date": meal_plan.week_start_date,
        "status": meal_plan.status,
        "meals": weekly_plan
    }

@router.put("/{meal_plan_id}/status")
async def update_meal_plan_status(
    meal_plan_id: int,
    request: UpdateStatusRequest,
    db: Session = Depends(get_db)
):
    """Update meal plan status (accept/reject)"""
    if request.status not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status. Must be 'accepted' or 'rejected'")
    
    meal_plan = db.query(MealPlan).filter(MealPlan.id == meal_plan_id).first()
    if not meal_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    
    meal_plan.status = request.status
    try:
        db.commit()
        db.refresh(meal_plan)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating meal plan: {str(e)}")
    
    return {
        "meal_plan_id": meal_plan.id,
        "status": meal_plan.status,
        "message": f"Meal plan {request.status} successfully"
    }

@router.get("/current")
async def get_current_meal_plan(
    db: Session = Depends(get_db)
):
    """Get the current week's meal plan"""
    current_plan = db.query(MealPlan)\
        .filter(MealPlan.week_start_date >= datetime.utcnow() - timedelta(days=7))\
        .order_by(MealPlan.created_at.desc())\
        .first()
    
    if not current_plan:
        raise HTTPException(status_code=404, detail="No current meal plan found")
    
    return {
        "meal_plan_id": current_plan.id,
        "week_start_date": current_plan.week_start_date,
        "status": current_plan.status,
        "meals": current_plan.recipes
    } 