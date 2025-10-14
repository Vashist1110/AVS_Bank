from flask import Blueprint, request, jsonify
from controllers.auth_controller import register_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    user = register_user(data)
    return jsonify({"message": "User registered", "id": user.id}), 201
