from flask import request, jsonify
from flask_jwt_extended import jwt_required
from app.model.models import User
from app import db
from app.utils.decorators import role_required

@jwt_required()
@role_required('admin')
def list_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "username": u.username, "role": u.role} for u in users])

@jwt_required()
@role_required('admin')
def update_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    user.username = data.get('username', user.username)
    user.role = data.get('role', user.role)
    db.session.commit()
    return jsonify({"msg": "User updated"})

@jwt_required()
@role_required('admin')
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted"})
