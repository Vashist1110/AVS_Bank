from flask import Blueprint
from app.controllers import user_controller, admin_controller

api_bp = Blueprint('api', __name__)

# User routes
api_bp.route('/register', methods=['POST'])(user_controller.register)
api_bp.route('/login', methods=['POST'])(user_controller.login)
api_bp.route('/profile', methods=['GET'])(user_controller.get_profile)

# Admin routes
api_bp.route('/admin/users', methods=['GET'])(admin_controller.list_users)
api_bp.route('/admin/users/<int:user_id>', methods=['PUT'])(admin_controller.update_user)
api_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])(admin_controller.delete_user)
