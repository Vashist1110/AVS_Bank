from app import db

class KYCDocument(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'))
    filename = db.Column(db.String(255))
    status = db.Column(db.String(50), default='pending')
