import bcrypt
import jwt
from datetime import datetime, timedelta
from config import Config

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode()

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(minutes=15)
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')
