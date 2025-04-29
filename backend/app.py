import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, PantryItem, FamilyMember, UserPreference
from dotenv import load_dotenv
import openai
from prompt_template import build_meal_plan_prompt

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

from flask_cors import CORS
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)

@app.route('/')
def index():
    return 'Flask backend is running!'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    user = User(username=data['username'], password=generate_password_hash(data['password'], method='pbkdf2:sha256'))
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created'})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        login_user(user)
        return jsonify({'message': 'Logged in'})
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out'})

@app.route('/api/session', methods=['GET'])
def check_session():
    if current_user.is_authenticated:
        return jsonify({'username': current_user.username})
    return jsonify({'username': None})

@app.route('/api/pantry', methods=['GET'])
@login_required
def get_pantry():
    items = PantryItem.query.filter_by(user_id=current_user.id).all()
    return jsonify([{'id': i.id, 'name': i.name, 'quantity': i.quantity} for i in items])

@app.route('/api/pantry', methods=['POST'])
@login_required
def update_pantry():
    items = request.json.get('items', [])
    # Remove all old items
    PantryItem.query.filter_by(user_id=current_user.id).delete()
    # Add new/edited items
    for item in items:
        db.session.add(PantryItem(name=item['name'], quantity=item['quantity'], user_id=current_user.id))
    db.session.commit()
    return jsonify({'message': 'Pantry updated'})

@app.route('/api/pantry/<int:item_id>', methods=['DELETE'])
@login_required
def delete_pantry_item(item_id):
    item = PantryItem.query.filter_by(id=item_id, user_id=current_user.id).first()
    if item:
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Item deleted'})
    return jsonify({'error': 'Item not found'}), 404

@app.route('/api/family', methods=['GET'])
@login_required
def get_family():
    members = FamilyMember.query.filter_by(user_id=current_user.id).all()
    return jsonify([{'id': m.id, 'first_name': m.first_name, 'age': m.age} for m in members])

@app.route('/api/family', methods=['POST'])
@login_required
def add_family_member():
    data = request.json
    member = FamilyMember(first_name=data['first_name'], age=data['age'], user_id=current_user.id)
    db.session.add(member)
    db.session.commit()
    return jsonify({'id': member.id, 'first_name': member.first_name, 'age': member.age})

@app.route('/api/family/<int:member_id>', methods=['PUT'])
@login_required
def update_family_member(member_id):
    data = request.json
    member = FamilyMember.query.filter_by(id=member_id, user_id=current_user.id).first()
    if not member:
        return jsonify({'error': 'Not found'}), 404
    member.first_name = data['first_name']
    member.age = data['age']
    db.session.commit()
    return jsonify({'id': member.id, 'first_name': member.first_name, 'age': member.age})

@app.route('/api/family/<int:member_id>', methods=['DELETE'])
@login_required
def delete_family_member(member_id):
    member = FamilyMember.query.filter_by(id=member_id, user_id=current_user.id).first()
    if not member:
        return jsonify({'error': 'Not found'}), 404
    db.session.delete(member)
    db.session.commit()
    return jsonify({'message': 'Deleted'})

@app.route('/api/preferences', methods=['GET'])
@login_required
def get_preferences():
    prefs = UserPreference.query.filter_by(user_id=current_user.id).all()
    return jsonify([{'id': p.id, 'name': p.name, 'checked': p.checked} for p in prefs])

@app.route('/api/preferences', methods=['POST'])
@login_required
def set_preferences():
    data = request.json.get('preferences', [])
    UserPreference.query.filter_by(user_id=current_user.id).delete()
    for pref in data:
        db.session.add(UserPreference(name=pref['name'], checked=pref['checked'], user_id=current_user.id))
    db.session.commit()
    return jsonify({'message': 'Preferences updated'})

@app.route('/api/preferences/<int:pref_id>', methods=['PUT'])
@login_required
def update_preference(pref_id):
    data = request.json
    pref = UserPreference.query.filter_by(id=pref_id, user_id=current_user.id).first()
    if not pref:
        return jsonify({'error': 'Not found'}), 404
    pref.checked = data['checked']
    db.session.commit()
    return jsonify({'id': pref.id, 'name': pref.name, 'checked': pref.checked})

@app.route('/api/mealplan', methods=['POST'])
@login_required
def mealplan():
    # Gather user data
    pantry_items = PantryItem.query.filter_by(user_id=current_user.id).all()
    family_members = FamilyMember.query.filter_by(user_id=current_user.id).all()
    preferences = UserPreference.query.filter_by(user_id=current_user.id).all()

    # Format data for the prompt with detailed information
    pantry_str = "Available ingredients:\n" + '\n'.join(
        f"- {item.name}: {item.quantity}" 
        for item in pantry_items
    ) if pantry_items else "No items in pantry"

    family_str = "Family composition:\n" + '\n'.join(
        f"- {m.first_name} (Age: {m.age})" 
        for m in family_members
    ) if family_members else "No family members listed"

    preferences_str = "Meal preferences:\n" + '\n'.join(
        f"- {p.name}" 
        for p in preferences if p.checked
    ) if any(p.checked for p in preferences) else "No specific preferences"

    # Build prompt
    prompt = build_meal_plan_prompt(pantry_str, family_str, preferences_str)

    # Call OpenAI API
    client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,  # Increased for longer response
            temperature=0.7
        )
        ai_reply = response.choices[0].message.content
        return jsonify({'plan': ai_reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)
