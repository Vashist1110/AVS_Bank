from models.customer import Customer
from app import db
from services.auth_service import hash_password

def register_user(data):
    hashed = hash_password(data['password'])
    user = Customer(email=data['email'], password_hash=hashed, name=data['name'])
    db.session.add(user)
    db.session.commit()
    return user
