from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.model.models import User
from app import db

def register():
    data = request.get_json()

    required_fields = ['name', 'phone', 'gender', 'dob', 'adhaar', 'pan',
                       'account_type', 'initial_balance', 'type_of_account',
                       'password', 'confirm_password']
    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({"msg": f"Missing fields: {', '.join(missing)}"}), 400

    if data['password'] != data['confirm_password']:
        return jsonify({"msg": "Passwords do not match"}), 400

    if User.query.filter_by(phone=data['phone']).first():
        return jsonify({"msg": "Phone number already registered"}), 400
    if data.get('email') and User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email already registered"}), 400
    if User.query.filter_by(adhaar=data['adhaar']).first():
        return jsonify({"msg": "Adhaar already registered"}), 400
    if User.query.filter_by(pan=data['pan']).first():
        return jsonify({"msg": "PAN already registered"}), 400

    user = User(
        name=data['name'],
        email=data.get('email'),
        phone=data['phone'],
        gender=data['gender'],
        dob=data['dob'],
        adhaar=data['adhaar'],
        pan=data['pan'],
        account_type=data['account_type'],
        initial_balance=data['initial_balance'],
        type_of_account=data['type_of_account']
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "Account created successfully"}), 201

def login():
    data = request.get_json()

    if not data or 'phone' not in data or 'password' not in data:
        return jsonify({"msg": "Phone and password are required"}), 400

    user = User.query.filter_by(phone=data['phone']).first()

    if user and user.check_password(data['password']):
        token = create_access_token(identity=str(user.id))
        return jsonify(access_token=token), 200

    return jsonify({"msg": "Invalid phone number or password"}), 401

@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "gender": user.gender,
        "dob": user.dob,
        "adhaar": user.adhaar,
        "pan": user.pan,
        "account_type": user.account_type,
        "initial_balance": user.initial_balance,
        "type_of_account": user.type_of_account,
        "role": user.role
    }), 200


@jwt_required()
def deposit():
    data = request.get_json()
    amount = data.get('amount')

    if not amount or amount <= 0:
        return jsonify({"msg": "Invalid deposit amount"}), 400

    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    user.initial_balance += amount
    db.session.commit()

    return jsonify({"msg": f"Deposited ₹{amount} successfully", "new_balance": user.initial_balance}), 200

@jwt_required()
def withdraw():
    data = request.get_json()
    amount = data.get('amount')

    if not amount or amount <= 0:
        return jsonify({"msg": "Invalid withdrawal amount"}), 400

    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if user.initial_balance < amount:
        return jsonify({"msg": "Insufficient funds"}), 400

    user.initial_balance -= amount
    db.session.commit()

    return jsonify({"msg": f"Withdrew ₹{amount} successfully", "new_balance": user.initial_balance}), 200
