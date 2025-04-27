import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface Recipe {
  id: number;
  name: string;
  cuisine_type: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string;
  servings: number;
  prep_time: number;
  cook_time: number;
  source_url: string;
}

export interface MealPlan {
  meal_plan_id: number;
  week_start_date: string;
  status: 'pending' | 'accepted' | 'rejected';
  meals: Array<{
    day: number;
    recipe_id: number;
    recipe_name: string;
  }>;
}

export interface WalmartCart {
  cart_id: string;
  status: string;
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
  walmart_url: string;
}

const api = {
  // Recipe endpoints
  searchRecipes: async (cuisineType: string): Promise<Recipe[]> => {
    const response = await axios.get(`${API_URL}/recipes/search/${cuisineType}`);
    return response.data;
  },

  getRecipe: async (recipeId: number): Promise<Recipe> => {
    const response = await axios.get(`${API_URL}/recipes/${recipeId}`);
    return response.data;
  },

  // Meal plan endpoints
  generateMealPlan: async (cuisineType: string): Promise<MealPlan> => {
    const response = await axios.post(`${API_URL}/meal-plans/generate?cuisine_type=${encodeURIComponent(cuisineType)}`);
    return response.data;
  },

  updateMealPlanStatus: async (mealPlanId: number, status: 'accepted' | 'rejected'): Promise<MealPlan> => {
    const response = await axios.put(`${API_URL}/meal-plans/${mealPlanId}/status`, { status });
    return response.data;
  },

  getCurrentMealPlan: async (): Promise<MealPlan> => {
    const response = await axios.get(`${API_URL}/meal-plans/current`);
    return response.data;
  },

  // Walmart cart endpoints
  createWalmartCart: async (mealPlanId: number): Promise<WalmartCart> => {
    const response = await axios.post(`${API_URL}/walmart/create-cart/${mealPlanId}`);
    return response.data;
  },

  getCartStatus: async (cartId: string): Promise<WalmartCart> => {
    const response = await axios.get(`${API_URL}/walmart/cart/${cartId}`);
    return response.data;
  },
};

export default api; 