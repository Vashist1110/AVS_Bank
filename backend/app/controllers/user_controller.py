from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.model.models import User
from app.model.transactionmodel import Transaction
from app.model.update_request_model import UserUpdateRequest
from app.model.kyc_request_model import KYCUpdateRequest
import os
from werkzeug.utils import secure_filename
from flask import current_app
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
        type_of_account=data['type_of_account'],
        account_number=User.generate_account_number()
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
        token = create_access_token(identity=str(user.account_number))
        return jsonify(access_token=token), 200

    return jsonify({"msg": "Invalid phone number or password"}), 401

@jwt_required()
def get_profile():
    account_number = get_jwt_identity()
    user = User.query.filter_by(account_number=account_number).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    has_pending_update = UserUpdateRequest.query.filter_by(
        user_id=user.id,
        status='pending'
    ).first() is not None

    kyc_request = KYCUpdateRequest.query.filter_by(user_id=user.id).order_by(
        KYCUpdateRequest.timestamp.desc()
    ).first()
    
    kyc_status = 'not_submitted'  # Default status
    if kyc_request:
        if kyc_request.status == 'pending':
            kyc_status = 'pending'
        elif kyc_request.status == 'approved':
            kyc_status = 'approved'
        elif kyc_request.status == 'rejected':
            kyc_status = 'rejected'

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "gender": user.gender,
        "dob": user.dob,
        "adhaar": user.adhaar,
        "account_number": user.account_number,
        "pan": user.pan,
        "account_type": user.account_type,
        "initial_balance": user.initial_balance,
        "type_of_account": user.type_of_account,
        "role": user.role,
        "has_pending_update_request": has_pending_update,
        "kyc_status": kyc_status
    }), 200


@jwt_required()
def request_kyc_update():
    account_number = get_jwt_identity()
    user = User.query.filter_by(account_number=account_number).first()

    existing_kyc = KYCUpdateRequest.query.filter_by(user_id=user.id).filter(
        KYCUpdateRequest.status.in_(['pending', 'approved'])
    ).first()
    
    if existing_kyc:
        if existing_kyc.status == 'pending':
            return jsonify({
                "msg": "You already have a pending KYC request. Please wait for admin review."
            }), 400
        elif existing_kyc.status == 'approved':
            return jsonify({
                "msg": "Your KYC has already been approved. No further updates needed."
            }), 400

    pancard = request.files.get('pancard')
    photo = request.files.get('photo')
    signature = request.files.get('signature')

    if not pancard or not photo or not signature:
        return jsonify({"msg": "All three files are required"}), 400

    upload_folder = os.path.join(current_app.root_path, 'uploads', 'kyc')
    os.makedirs(upload_folder, exist_ok=True)

    pancard_path = os.path.join(upload_folder, secure_filename(pancard.filename))
    photo_path = os.path.join(upload_folder, secure_filename(photo.filename))
    signature_path = os.path.join(upload_folder, secure_filename(signature.filename))

    pancard.save(pancard_path)
    photo.save(photo_path)
    signature.save(signature_path)

    kyc_request = KYCUpdateRequest(
        user_id=user.id,
        pancard_image=pancard_path,
        photo_image=photo_path,
        signature_image=signature_path
    )
    db.session.add(kyc_request)
    db.session.commit()

    return jsonify({"msg": "KYC update request submitted"}), 200


@jwt_required()
def deposit():
    data = request.get_json()
    amount = data.get('amount')

    if not amount or amount <= 0:
        return jsonify({"msg": "Invalid deposit amount"}), 400

    account_number = get_jwt_identity()
    user = User.query.filter_by(account_number=account_number).first()
    user.initial_balance += amount
    transaction = Transaction(
        user_id=user.id,
        amount=amount,
        type='credit',
        description='Deposit'
    )
    db.session.add(transaction)
    db.session.commit()

    return jsonify({"msg": f"Deposited ₹{amount} successfully", "new_balance": user.initial_balance}), 200

@jwt_required()
def withdraw():
    data = request.get_json()
    amount = data.get('amount')

    if not amount or amount <= 0:
        return jsonify({"msg": "Invalid withdrawal amount"}), 400

    account_number = get_jwt_identity()
    user = User.query.filter_by(account_number=account_number).first()

    if user.initial_balance < amount:
        return jsonify({"msg": "Insufficient funds"}), 400

    user.initial_balance -= amount
    transaction = Transaction(
        user_id=user.id,
        amount=amount,
        type='debit',
        description='Withdrawal'
    )
    db.session.add(transaction)
    db.session.commit()

    return jsonify({"msg": f"Withdrew ₹{amount} successfully", "new_balance": user.initial_balance}), 200



@jwt_required()
def request_update():
    account_number = get_jwt_identity()
    user = User.query.filter_by(account_number=account_number).first()
    
    pending_requests = UserUpdateRequest.query.filter_by(
        user_id=user.id, 
        status='pending'
    ).first()
    
    if pending_requests:
        return jsonify({
            "msg": "You already have a pending update request. Please wait for admin approval or rejection."
        }), 400
    
    data = request.get_json()

    allowed_fields = ['name', 'email', 'phone', 'gender', 'dob']
    requests = []

    for field in allowed_fields:
        if field in data and getattr(user, field) != data[field]:
            req = UserUpdateRequest(
                user_id=user.id,
                field=field,
                old_value=getattr(user, field),
                new_value=data[field]
            )
            requests.append(req)

    if not requests:
        return jsonify({"msg": "No changes submitted"}), 400

    db.session.add_all(requests)
    db.session.commit()

    return jsonify({"msg": "Update request submitted for approval"}), 200
