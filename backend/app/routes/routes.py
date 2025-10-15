from flask import Blueprint
from app.controllers import user_controller, admin_controller

api_bp = Blueprint('api', __name__)

api_bp.route('/register', methods=['POST'])(user_controller.register)
api_bp.route('/login', methods=['POST'])(user_controller.login)  # login via phone
api_bp.route('/profile', methods=['GET'])(user_controller.get_profile)
api_bp.route('/deposit', methods=['POST'])(user_controller.deposit)
api_bp.route('/withdraw', methods=['POST'])(user_controller.withdraw)
api_bp.route('/request-update', methods=['POST'])(user_controller.request_update)
api_bp.route('/request-kyc-update', methods=['POST'])(user_controller.request_kyc_update)




api_bp.route('/admin/kyc-requests', methods=['GET'])(admin_controller.list_kyc_requests)
api_bp.route('/admin/kyc-requests/<int:request_id>', methods=['POST'])(admin_controller.process_kyc_request)
api_bp.route('/admin/login', methods=['POST'])(admin_controller.admin_login)  # login via username
api_bp.route('/admin/users', methods=['GET'])(admin_controller.list_users)
api_bp.route('/admin/users/<int:user_id>', methods=['PUT'])(admin_controller.update_user)
api_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])(admin_controller.delete_user)
api_bp.route('/admin/dashboard', methods=['GET'])(admin_controller.dashboard)
api_bp.route('/admin/create-user', methods=['POST'])(admin_controller.create_user)
api_bp.route('/admin/users/<int:user_id>/transactions', methods=['GET'])(admin_controller.get_user_transactions)
api_bp.route('/admin/update-requests', methods=['GET'])(admin_controller.list_update_requests)
api_bp.route('/admin/update-requests/<int:request_id>', methods=['POST'])(admin_controller.process_update_request)

