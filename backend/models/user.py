from datetime import date
from config.database import db

class User(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    contact_number = db.Column(db.String(20), nullable=True)
    date_of_joining = db.Column(db.Date, nullable=False, default=date.today)
    password_hash = db.Column(db.String(255), nullable=False)
