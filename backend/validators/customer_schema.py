from app import ma
from marshmallow import fields, validate

class CustomerSchema(ma.Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6))
    name = fields.String(required=True)
