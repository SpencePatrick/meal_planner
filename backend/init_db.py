from app.db.base_class import Base
from app.db.session import engine
from app.models.models import Recipe, MealPlan, WalmartCart  # Import all models

def init_db():
    print("Creating database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
    except Exception as e:
        print(f"Error creating database tables: {str(e)}")
        raise e

if __name__ == "__main__":
    init_db() 