from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
ma = Marshmallow()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    db.init_app(app)
    ma.init_app(app)

    # Register routes
    from routes.auth_routes import auth_bp
    from routes.profile_routes import profile_bp
    from routes.kyc_routes import kyc_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(kyc_bp)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
