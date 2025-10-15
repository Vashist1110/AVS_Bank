from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from app.model.models import User
from app.model.adminmodel import Admin

def role_required(role):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()

            # Check User table
            user = User.query.filter_by(id=user_id).first()
            if user and user.role == role:
                return fn(*args, **kwargs)

            # Check Admin table if role is 'admin'
            if role == 'admin':
                admin = Admin.query.filter_by(id=user_id).first()
                if admin:
                    return fn(*args, **kwargs)

            return jsonify({"msg": "Access denied"}), 403
        return wrapper
    return decorator
