from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    
    # Enable CORS
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    db.init_app(app)
    jwt.init_app(app)

    from app.routes.routes import api_bp
    app.register_blueprint(api_bp)

    return app
