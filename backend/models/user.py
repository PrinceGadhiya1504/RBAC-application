from datetime import date
from sqlalchemy.orm import validates
from config.database import db
from models.base import AuditBase

class User(AuditBase):
    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    contact_number = db.Column(db.String(20), nullable=True)
    date_of_joining = db.Column(db.Date, nullable=False, default=date.today)
    password_hash = db.Column(db.String(255), nullable=False)

    @validates("email")
    def validate_email(self, key, address):
        if address:
            return str(address).strip().lower()
        return address
