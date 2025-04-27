from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import requests
from bs4 import BeautifulSoup
from app.db.session import get_db
from app.models.models import Recipe
from app.core.config import settings

router = APIRouter()

def search_recipes_online(cuisine_type: str) -> List[dict]:
    """Search for recipes online based on cuisine type"""
    # This is a placeholder - you'll need to implement actual web scraping
    # or use a recipe API service
    search_url = f"https://www.food.com/search/{cuisine_type}-recipes"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(search_url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        recipes = []
        
        # This is a simplified example - you'll need to adjust selectors based on the actual website
        for recipe in soup.find_all('div', class_='recipe-card')[:10]:  # Limit to 10 recipes
            recipes.append({
                'name': recipe.find('h2').text.strip(),
                'ingredients': [],  # You'll need to scrape these
                'instructions': '',  # You'll need to scrape these
                'source_url': recipe.find('a')['href'],
                'cuisine_type': cuisine_type,
                'servings': 2,  # Default for 2 adults
                'prep_time': 30,  # Default values
                'cook_time': 30,  # Default values
            })
        
        return recipes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recipes: {str(e)}")

@router.get("/search/{cuisine_type}")
async def search_recipes(
    cuisine_type: str,
    db: Session = Depends(get_db)
) -> List[dict]:
    """Search for recipes by cuisine type"""
    # First check database for cached recipes
    db_recipes = db.query(Recipe).filter(Recipe.cuisine_type == cuisine_type).all()
    
    if not db_recipes:
        # If no cached recipes, search online
        recipes = search_recipes_online(cuisine_type)
        
        # Cache the recipes in the database
        for recipe_data in recipes:
            recipe = Recipe(**recipe_data)
            db.add(recipe)
        
        try:
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Error saving recipes: {str(e)}")
        
        return recipes
    
    # Convert DB models to dictionaries
    return [
        {
            "id": recipe.id,
            "name": recipe.name,
            "cuisine_type": recipe.cuisine_type,
            "ingredients": recipe.ingredients,
            "instructions": recipe.instructions,
            "servings": recipe.servings,
            "prep_time": recipe.prep_time,
            "cook_time": recipe.cook_time,
            "source_url": recipe.source_url,
        }
        for recipe in db_recipes
    ]

@router.get("/{recipe_id}")
async def get_recipe(
    recipe_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific recipe by ID"""
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe 