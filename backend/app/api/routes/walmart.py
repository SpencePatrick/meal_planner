from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from app.db.session import get_db
from app.models.models import WalmartCart, MealPlan, Recipe
from app.core.config import settings
import requests
import uuid

router = APIRouter()

class WalmartAPI:
    def __init__(self):
        self.api_key = settings.WALMART_API_KEY
        self.api_secret = settings.WALMART_API_SECRET
        self.base_url = "https://marketplace.walmartapis.com/v3"
        
    def search_product(self, query: str) -> Dict:
        """Search for a product on Walmart"""
        headers = self._get_headers()
        response = requests.get(
            f"{self.base_url}/items/search",
            headers=headers,
            params={"query": query}
        )
        return response.json()
    
    def create_cart(self, items: List[Dict]) -> Dict:
        """Create a new cart with items"""
        headers = self._get_headers()
        payload = {
            "items": items
        }
        response = requests.post(
            f"{self.base_url}/cart",
            headers=headers,
            json=payload
        )
        return response.json()
    
    def _get_headers(self) -> Dict:
        """Get authentication headers"""
        return {
            "WM_SEC.ACCESS_TOKEN": self.api_key,
            "WM_SEC.SECRET": self.api_secret,
            "Accept": "application/json",
            "Content-Type": "application/json"
        }

walmart_api = WalmartAPI()

def get_ingredient_quantities(recipes: List[Recipe]) -> Dict[str, float]:
    """Aggregate ingredients from multiple recipes"""
    ingredients = {}
    for recipe in recipes:
        for item in recipe.ingredients:
            name = item["name"]
            quantity = item.get("quantity", 1)
            unit = item.get("unit", "piece")
            
            if name in ingredients:
                ingredients[name]["quantity"] += quantity
            else:
                ingredients[name] = {
                    "quantity": quantity,
                    "unit": unit
                }
    return ingredients

@router.post("/create-cart/{meal_plan_id}")
async def create_walmart_cart(
    meal_plan_id: int,
    db: Session = Depends(get_db)
):
    """Create a mock Walmart cart for development"""
    # Get the meal plan
    meal_plan = db.query(MealPlan).filter(MealPlan.id == meal_plan_id).first()
    if not meal_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    
    if meal_plan.status != "accepted":
        raise HTTPException(status_code=400, detail="Can only create cart for accepted meal plans")
    
    # Create a mock cart
    mock_cart_id = str(uuid.uuid4())
    cart_items = [
        {"product_id": "123", "quantity": 1, "name": "Sample Product 1"},
        {"product_id": "456", "quantity": 2, "name": "Sample Product 2"}
    ]
    
    try:
        # Save mock cart information
        cart = WalmartCart(
            meal_plan_id=meal_plan_id,
            cart_id=mock_cart_id,
            items=cart_items,
            status="created"
        )
        
        db.add(cart)
        db.commit()
        db.refresh(cart)
        
        return {
            "cart_id": cart.cart_id,
            "status": cart.status,
            "items": cart.items,
            "walmart_url": "https://www.walmart.com/cart/mockCart"
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating mock cart: {str(e)}")

@router.get("/cart/{cart_id}")
async def get_cart_status(
    cart_id: str,
    db: Session = Depends(get_db)
):
    """Get the status of a Walmart cart"""
    cart = db.query(WalmartCart).filter(WalmartCart.cart_id == cart_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    return {
        "cart_id": cart.cart_id,
        "status": cart.status,
        "items": cart.items,
        "created_at": cart.created_at,
        "updated_at": cart.updated_at,
        "walmart_url": "https://www.walmart.com/cart/mockCart"
    } 