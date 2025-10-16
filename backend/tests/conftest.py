"""
PyTest configuration and shared fixtures
"""
import pytest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy


@pytest.fixture
def app():
    """Create a Flask app for testing"""
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'test-secret-key'
    
    return app


@pytest.fixture
def client(app):
    """Create a test client"""
    return app.test_client()


@pytest.fixture
def db(app):
    """Create a test database"""
    database = SQLAlchemy(app)
    
    with app.app_context():
        database.create_all()
        yield database
        database.drop_all()


@pytest.fixture
def runner(app):
    """Create a test CLI runner"""
    return app.test_cli_runner()
