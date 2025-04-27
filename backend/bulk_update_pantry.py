from app import db, PantryItem, User, app

with app.app_context():
    user = User.query.filter_by(username='spatrick').first()
    if not user:
        print("User not found!")
        exit(1)

    items = [
        {"name": "chicken breasts. frozen", "quantity": "12"},
        {"name": "butt country style ribs frozen", "quantity": "2.8 lbs"},
        {"name": "salmon filets frozen", "quantity": "3 2.5lb"},
        {"name": "celery", "quantity": "large stock"},
        {"name": "sugar snap peas", "quantity": "24 oz"},
        {"name": "sweet mini peppers", "quantity": "6"},
        {"name": "cauliflower", "quantity": "1 head"},
        {"name": "fresh spinach", "quantity": "1 bag"},
        {"name": "string cheese", "quantity": "25"},
        {"name": "salami slices", "quantity": "some"},
        {"name": "pepperoni slices", "quantity": "some"},
        {"name": "turkey lunch meat", "quantity": "some"},
        {"name": "apples", "quantity": "6"},
        {"name": "small oranges", "quantity": "10"},
    ]

    # Remove old items
    PantryItem.query.filter_by(user_id=user.id).delete()
    for item in items:
        db.session.add(PantryItem(name=item["name"], quantity=item["quantity"], user_id=user.id))
    db.session.commit()
    print("Pantry updated!") 