from app import db

class Transaction(db.Model):
    __tablename__ = 'transaction'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(10), nullable=False)  # 'credit' or 'debit'
    description = db.Column(db.String(200))
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<Transaction {self.id} | User {self.user_id} | {self.type} ₹{self.amount}>"
