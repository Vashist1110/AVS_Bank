from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.model.models import User
from app import db
from app.utils.decorators import role_required
from app.model.transactionmodel import Transaction
from app.model.kyc_request_model import KYCUpdateRequest
from app.model.adminmodel import Admin


def admin_login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"msg": "Username and password required"}), 400

    admin = Admin.query.filter_by(username=data['username']).first()  # ✅ Use Admin model
    if admin and admin.check_password(data['password']):
        token = create_access_token(identity=str(admin.id))
        return jsonify(access_token=token), 200

    return jsonify({"msg": "Invalid credentials"}), 401




@jwt_required()
@role_required('admin')
def list_kyc_requests():
    requests = KYCUpdateRequest.query.filter_by(status='pending').all()
    return jsonify([
        {
            "id": r.id,
            "user_id": r.user_id,
            "account_number": r.user.account_number if r.user else None,
            "pancard_image": r.pancard_image,
            "photo_image": r.photo_image,
            "signature_image": r.signature_image,
            "timestamp": r.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        } for r in requests
    ]), 200


@jwt_required()
@role_required('admin')
def process_kyc_request(request_id):
    data = request.get_json()
    action = data.get('action')  # 'approve' or 'reject'

    req = KYCUpdateRequest.query.get(request_id)
    if not req or req.status != 'pending':
        return jsonify({"msg": "Request not found or already processed"}), 404

    if action == 'approve':
        req.status = 'approved'
        # Optionally update user's verified status or store approved KYC files
    elif action == 'reject':
        req.status = 'rejected'
    else:
        return jsonify({"msg": "Invalid action"}), 400

    db.session.commit()
    return jsonify({"msg": f"KYC request {action}ed successfully"}), 200



@jwt_required()
@role_required('admin')
def list_users():
    users = User.query.filter_by(role='user').all()
    return jsonify([
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "phone": u.phone,
            "gender": u.gender,
            "dob": u.dob,
            "adhaar": u.adhaar,
            "pan": u.pan,
            "account_type": u.account_type,
            "initial_balance": u.initial_balance,
            "type_of_account": u.type_of_account
        } for u in users
    ]), 200


@jwt_required()
@role_required('admin')
def update_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if not user or user.role != 'user':
        return jsonify({"msg": "User not found"}), 404

    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    user.phone = data.get('phone', user.phone)
    user.gender = data.get('gender', user.gender)
    user.dob = data.get('dob', user.dob)
    user.adhaar = data.get('adhaar', user.adhaar)
    user.pan = data.get('pan', user.pan)
    user.account_type = data.get('account_type', user.account_type)
    user.initial_balance = data.get('initial_balance', user.initial_balance)
    user.type_of_account = data.get('type_of_account', user.type_of_account)

    db.session.commit()
    return jsonify({"msg": "User updated successfully"}), 200


@jwt_required()
@role_required('admin')
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user or user.role != 'user':
        return jsonify({"msg": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted successfully"}), 200


@jwt_required()
@role_required('admin')
def dashboard():
    total_users = User.query.filter_by(role='user').count()
    total_balance = db.session.query(db.func.sum(User.initial_balance)).scalar() or 0.0
    male_users = User.query.filter_by(gender='Male', role='user').count()
    female_users = User.query.filter_by(gender='Female', role='user').count()
    savings_accounts = User.query.filter_by(account_type='savings', role='user').count()
    current_accounts = User.query.filter_by(account_type='current', role='user').count()

    return jsonify({
        "total_users": total_users,
        "total_balance": total_balance,
        "male_users": male_users,
        "female_users": female_users,
        "savings_accounts": savings_accounts,
        "current_accounts": current_accounts
    }), 200


@jwt_required()
@role_required('admin')
def create_user():
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
        account_number=User.generate_account_number(),
        role='user'
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201


@jwt_required()
@role_required('admin')
def list_update_requests():
    from app.model.update_request_model import UserUpdateRequest

    requests = UserUpdateRequest.query.filter_by(status='pending').all()
    return jsonify([
        {
            "id": r.id,
            "user_id": r.user_id,
            "field": r.field,
            "old_value": r.old_value,
            "new_value": r.new_value,
            "timestamp": r.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        } for r in requests
    ]), 200


@jwt_required()
@role_required('admin')
def process_update_request(request_id):
    from app.model.update_request_model import UserUpdateRequest

    data = request.get_json()
    action = data.get('action')  # 'approve' or 'reject'

    req = UserUpdateRequest.query.get(request_id)
    if not req or req.status != 'pending':
        return jsonify({"msg": "Request not found or already processed"}), 404

    if action == 'approve':
        user = User.query.get(req.user_id)
        setattr(user, req.field, req.new_value)
        req.status = 'approved'
    elif action == 'reject':
        req.status = 'rejected'
    else:
        return jsonify({"msg": "Invalid action"}), 400

    db.session.commit()
    return jsonify({"msg": f"Request {action}ed successfully"}), 200




@jwt_required()
@role_required('admin')
def list_users():
    users = User.query.filter_by(role='user').all()
    return jsonify([
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "phone": u.phone,
            "gender": u.gender,
            "dob": u.dob,
            "adhaar": u.adhaar,
            "pan": u.pan,
            "account_number": u.account_number,
            "account_type": u.account_type,
            "initial_balance": u.initial_balance,
            "type_of_account": u.type_of_account
        } for u in users
    ]), 200



@jwt_required()
@role_required('admin')
def get_user_transactions(user_id):
    user = User.query.get(user_id)
    if not user or user.role != 'user':
        return jsonify({"msg": "User not found"}), 404

    transactions = user.transactions.order_by(Transaction.timestamp.desc()).limit(10).all()

    return jsonify([
        {
            "id": txn.id,
            "amount": txn.amount,
            "type": txn.type,
            "description": txn.description,
            "timestamp": txn.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        } for txn in transactions
    ]), 200
