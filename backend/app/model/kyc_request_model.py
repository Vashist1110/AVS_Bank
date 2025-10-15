from app import db

class KYCUpdateRequest(db.Model):
    __tablename__ = 'kyc_update_request'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    pancard_image = db.Column(db.String(255), nullable=False)
    photo_image = db.Column(db.String(255), nullable=False)
    signature_image = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship('User', backref=db.backref('kyc_requests', lazy='dynamic'))
