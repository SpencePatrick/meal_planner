from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    cuisine_type = Column(String, index=True)
    ingredients = Column(JSON)
    instructions = Column(String)
    servings = Column(Integer)
    prep_time = Column(Integer)  # in minutes
    cook_time = Column(Integer)  # in minutes
    source_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    week_start_date = Column(DateTime, index=True)
    status = Column(String, default="pending")  # pending, accepted, rejected
    recipes = Column(JSON)  # List of recipe IDs for each day
    created_at = Column(DateTime, default=datetime.utcnow)
    
class WalmartCart(Base):
    __tablename__ = "walmart_carts"

    id = Column(Integer, primary_key=True, index=True)
    meal_plan_id = Column(Integer, ForeignKey("meal_plans.id"))
    cart_id = Column(String, unique=True)
    items = Column(JSON)  # List of Walmart product IDs and quantities
    status = Column(String, default="pending")  # pending, created, checked_out
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 