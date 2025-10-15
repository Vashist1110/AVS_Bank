from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    dob = db.Column(db.String(10), nullable=False)  # Format: YYYY-MM-DD
    adhaar = db.Column(db.String(12), unique=True, nullable=False)
    pan = db.Column(db.String(10), unique=True, nullable=False)
    account_type = db.Column(db.String(20), nullable=False)  # e.g., Savings, Current
    initial_balance = db.Column(db.Float, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(10), default='user')
    type_of_account = db.Column(db.String(20), nullable=True)
    account_number = db.Column(db.String(7), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    transactions = db.relationship('Transaction', backref='user', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def generate_account_number():
        last_user = User.query.order_by(User.account_number.desc()).first()
        
        if last_user and last_user.account_number:
            try:
                last_number = int(last_user.account_number.replace('AVS', ''))
                next_number = last_number + 1
            except (ValueError, AttributeError):
                next_number = 1001
        else:
            next_number = 1001
        
        return f"AVS{next_number}"
