"""
Integration tests for database operations
These tests use an in-memory SQLite database and don't connect to the existing codebase
"""
import pytest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Create a standalone database instance for testing
db = SQLAlchemy()


class TestUser(db.Model):
    """Test User model"""
    __tablename__ = 'test_users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    accounts = db.relationship('TestAccount', backref='owner', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }


class TestAccount(db.Model):
    """Test Account model"""
    __tablename__ = 'test_accounts'
    
    id = db.Column(db.Integer, primary_key=True)
    account_number = db.Column(db.String(20), unique=True, nullable=False)
    balance = db.Column(db.Float, default=0.0)
    user_id = db.Column(db.Integer, db.ForeignKey('test_users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'account_number': self.account_number,
            'balance': self.balance,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat()
        }


@pytest.fixture
def test_app():
    """Create and configure a test Flask app"""
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def test_db(test_app):
    """Provide database instance"""
    with test_app.app_context():
        yield db


class TestDatabaseOperations:
    """Integration tests for database operations"""
    
    def test_create_user(self, test_app, test_db):
        """Test creating a user in database"""
        with test_app.app_context():
            user = TestUser(username='testuser', email='test@example.com')
            test_db.session.add(user)
            test_db.session.commit()
            
            # Query the user
            retrieved_user = TestUser.query.filter_by(username='testuser').first()
            assert retrieved_user is not None
            assert retrieved_user.username == 'testuser'
            assert retrieved_user.email == 'test@example.com'
    
    def test_create_multiple_users(self, test_app, test_db):
        """Test creating multiple users"""
        with test_app.app_context():
            users = [
                TestUser(username='user1', email='user1@example.com'),
                TestUser(username='user2', email='user2@example.com'),
                TestUser(username='user3', email='user3@example.com'),
            ]
            
            for user in users:
                test_db.session.add(user)
            test_db.session.commit()
            
            # Query all users
            all_users = TestUser.query.all()
            assert len(all_users) == 3
    
    def test_update_user(self, test_app, test_db):
        """Test updating a user"""
        with test_app.app_context():
            # Create user
            user = TestUser(username='updateuser', email='old@example.com')
            test_db.session.add(user)
            test_db.session.commit()
            
            # Update user
            user.email = 'new@example.com'
            test_db.session.commit()
            
            # Verify update
            updated_user = TestUser.query.filter_by(username='updateuser').first()
            assert updated_user.email == 'new@example.com'
    
    def test_delete_user(self, test_app, test_db):
        """Test deleting a user"""
        with test_app.app_context():
            # Create user
            user = TestUser(username='deleteuser', email='delete@example.com')
            test_db.session.add(user)
            test_db.session.commit()
            
            # Delete user
            test_db.session.delete(user)
            test_db.session.commit()
            
            # Verify deletion
            deleted_user = TestUser.query.filter_by(username='deleteuser').first()
            assert deleted_user is None
    
    def test_create_account_with_user(self, test_app, test_db):
        """Test creating an account associated with a user"""
        with test_app.app_context():
            # Create user
            user = TestUser(username='accountowner', email='owner@example.com')
            test_db.session.add(user)
            test_db.session.commit()
            
            # Create account for user
            account = TestAccount(
                account_number='ACC123456',
                balance=1000.0,
                user_id=user.id
            )
            test_db.session.add(account)
            test_db.session.commit()
            
            # Query account
            retrieved_account = TestAccount.query.filter_by(account_number='ACC123456').first()
            assert retrieved_account is not None
            assert retrieved_account.balance == 1000.0
            assert retrieved_account.user_id == user.id
    
    def test_user_account_relationship(self, test_app, test_db):
        """Test relationship between user and accounts"""
        with test_app.app_context():
            # Create user
            user = TestUser(username='multiaccountuser', email='multi@example.com')
            test_db.session.add(user)
            test_db.session.commit()
            
            # Create multiple accounts
            accounts = [
                TestAccount(account_number='ACC001', balance=1000.0, user_id=user.id),
                TestAccount(account_number='ACC002', balance=2000.0, user_id=user.id),
                TestAccount(account_number='ACC003', balance=3000.0, user_id=user.id),
            ]
            
            for account in accounts:
                test_db.session.add(account)
            test_db.session.commit()
            
            # Query user with accounts
            user_with_accounts = TestUser.query.filter_by(username='multiaccountuser').first()
            assert len(user_with_accounts.accounts) == 3
            
            total_balance = sum(acc.balance for acc in user_with_accounts.accounts)
            assert total_balance == 6000.0
    
    def test_unique_constraint(self, test_app, test_db):
        """Test unique constraint on username"""
        with test_app.app_context():
            # Create first user
            user1 = TestUser(username='uniqueuser', email='unique1@example.com')
            test_db.session.add(user1)
            test_db.session.commit()
            
            # Try to create duplicate username
            user2 = TestUser(username='uniqueuser', email='unique2@example.com')
            test_db.session.add(user2)
            
            with pytest.raises(Exception):  # SQLAlchemy will raise an IntegrityError
                test_db.session.commit()
            
            test_db.session.rollback()
    
    def test_query_filtering(self, test_app, test_db):
        """Test querying with filters"""
        with test_app.app_context():
            # Create users with accounts
            user1 = TestUser(username='richuser', email='rich@example.com')
            user2 = TestUser(username='pooruser', email='poor@example.com')
            test_db.session.add_all([user1, user2])
            test_db.session.commit()
            
            account1 = TestAccount(account_number='RICH001', balance=10000.0, user_id=user1.id)
            account2 = TestAccount(account_number='POOR001', balance=100.0, user_id=user2.id)
            test_db.session.add_all([account1, account2])
            test_db.session.commit()
            
            # Query accounts with balance > 1000
            high_balance_accounts = TestAccount.query.filter(TestAccount.balance > 1000).all()
            assert len(high_balance_accounts) == 1
            assert high_balance_accounts[0].account_number == 'RICH001'
    
    def test_cascade_delete(self, test_app, test_db):
        """Test that deleting user doesn't fail with related accounts"""
        with test_app.app_context():
            # Create user with account
            user = TestUser(username='cascadeuser', email='cascade@example.com')
            test_db.session.add(user)
            test_db.session.commit()
            
            account = TestAccount(account_number='CASCADE001', balance=500.0, user_id=user.id)
            test_db.session.add(account)
            test_db.session.commit()
            
            user_id = user.id
            
            # Delete user
            test_db.session.delete(user)
            test_db.session.commit()
            
            # Check that user is deleted
            deleted_user = TestUser.query.get(user_id)
            assert deleted_user is None
