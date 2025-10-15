from flask_jwt_extended import get_jwt_identity
from functools import wraps
from flask import jsonify
from app.model.models import User

def role_required(role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if user and user.role == role:
                return fn(*args, **kwargs)
            return jsonify({"msg": "Access denied"}), 403
        return decorator
    return wrapper
