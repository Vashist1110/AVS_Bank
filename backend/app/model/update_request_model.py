from app import db

class UserUpdateRequest(db.Model):
    __tablename__ = 'user_update_request'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    field = db.Column(db.String(50), nullable=False)
    old_value = db.Column(db.String(255))
    new_value = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship('User', backref=db.backref('update_requests', lazy='dynamic'))
