"""
Integration tests for API endpoints
These tests demonstrate integration testing without connecting to the existing codebase
"""
import pytest
import json
from flask import Flask, jsonify, request


def create_test_app():
    """Create a simple Flask app for testing"""
    app = Flask(__name__)
    app.config['TESTING'] = True
    
    # Mock data storage
    users = {}
    accounts = {}
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({'status': 'healthy', 'service': 'test-api'}), 200
    
    @app.route('/api/users', methods=['POST'])
    def create_user():
        """Create a new user"""
        data = request.get_json()
        
        if not data or 'username' not in data or 'email' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        
        username = data['username']
        
        if username in users:
            return jsonify({'error': 'User already exists'}), 409
        
        users[username] = {
            'username': username,
            'email': data['email'],
            'created_at': '2025-10-16'
        }
        
        return jsonify({'message': 'User created', 'user': users[username]}), 201
    
    @app.route('/api/users/<username>', methods=['GET'])
    def get_user(username):
        """Get user by username"""
        if username not in users:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': users[username]}), 200
    
    @app.route('/api/accounts', methods=['POST'])
    def create_account():
        """Create a new account"""
        data = request.get_json()
        
        if not data or 'account_id' not in data or 'username' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        
        account_id = data['account_id']
        
        if account_id in accounts:
            return jsonify({'error': 'Account already exists'}), 409
        
        if data['username'] not in users:
            return jsonify({'error': 'User not found'}), 404
        
        accounts[account_id] = {
            'account_id': account_id,
            'username': data['username'],
            'balance': data.get('balance', 0.0)
        }
        
        return jsonify({'message': 'Account created', 'account': accounts[account_id]}), 201
    
    @app.route('/api/accounts/<account_id>', methods=['GET'])
    def get_account(account_id):
        """Get account by ID"""
        if account_id not in accounts:
            return jsonify({'error': 'Account not found'}), 404
        
        return jsonify({'account': accounts[account_id]}), 200
    
    return app


class TestAPIIntegration:
    """Integration tests for API endpoints"""
    
    @pytest.fixture
    def app(self):
        """Create test app"""
        return create_test_app()
    
    @pytest.fixture
    def client(self, app):
        """Create test client"""
        return app.test_client()
    
    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get('/api/health')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert data['status'] == 'healthy'
        assert data['service'] == 'test-api'
    
    def test_create_user_success(self, client):
        """Test creating a new user"""
        user_data = {
            'username': 'testuser',
            'email': 'test@example.com'
        }
        
        response = client.post(
            '/api/users',
            data=json.dumps(user_data),
            content_type='application/json'
        )
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['message'] == 'User created'
        assert data['user']['username'] == 'testuser'
        assert data['user']['email'] == 'test@example.com'
    
    def test_create_user_missing_fields(self, client):
        """Test creating user with missing fields"""
        user_data = {'username': 'testuser'}
        
        response = client.post(
            '/api/users',
            data=json.dumps(user_data),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_create_duplicate_user(self, client):
        """Test creating duplicate user"""
        user_data = {
            'username': 'duplicate',
            'email': 'dup@example.com'
        }
        
        # Create first user
        client.post(
            '/api/users',
            data=json.dumps(user_data),
            content_type='application/json'
        )
        
        # Try to create duplicate
        response = client.post(
            '/api/users',
            data=json.dumps(user_data),
            content_type='application/json'
        )
        
        assert response.status_code == 409
        data = json.loads(response.data)
        assert 'already exists' in data['error']
    
    def test_get_user(self, client):
        """Test getting a user"""
        # First create a user
        user_data = {
            'username': 'getuser',
            'email': 'get@example.com'
        }
        client.post(
            '/api/users',
            data=json.dumps(user_data),
            content_type='application/json'
        )
        
        # Then retrieve it
        response = client.get('/api/users/getuser')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert data['user']['username'] == 'getuser'
    
    def test_get_nonexistent_user(self, client):
        """Test getting a user that doesn't exist"""
        response = client.get('/api/users/nonexistent')
        assert response.status_code == 404
    
    def test_create_account_workflow(self, client):
        """Test complete workflow: create user then account"""
        # Step 1: Create user
        user_data = {
            'username': 'accountuser',
            'email': 'account@example.com'
        }
        response = client.post(
            '/api/users',
            data=json.dumps(user_data),
            content_type='application/json'
        )
        assert response.status_code == 201
        
        # Step 2: Create account for user
        account_data = {
            'account_id': 'ACC001',
            'username': 'accountuser',
            'balance': 1000.0
        }
        response = client.post(
            '/api/accounts',
            data=json.dumps(account_data),
            content_type='application/json'
        )
        assert response.status_code == 201
        
        data = json.loads(response.data)
        assert data['account']['account_id'] == 'ACC001'
        assert data['account']['balance'] == 1000.0
    
    def test_create_account_for_nonexistent_user(self, client):
        """Test creating account for non-existent user"""
        account_data = {
            'account_id': 'ACC999',
            'username': 'nonexistent',
            'balance': 500.0
        }
        
        response = client.post(
            '/api/accounts',
            data=json.dumps(account_data),
            content_type='application/json'
        )
        
        assert response.status_code == 404
        data = json.loads(response.data)
        assert 'User not found' in data['error']
