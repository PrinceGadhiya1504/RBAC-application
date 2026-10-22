from datetime import date
from flask_bcrypt import Bcrypt
from sqlalchemy import select
from config.database import db
from models.user import User
from flask_jwt_extended import create_access_token

bcrypt = Bcrypt()

def register_user(data):
    email = data["email"].strip().lower()

    existing_user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if existing_user:
        return {
            "success": False,
            "message": "Email is already registered.",
            "status_code": 409,
        }

    password_hash = bcrypt.generate_password_hash(
        data["password"]
    ).decode("utf-8")

    user = User(
        full_name=data["full_name"].strip(),
        email=email.lower(),
        contact_number=(
            data.get("contact_number", "").strip() or None
        ),
        date_of_joining=date.today(),
        password_hash=password_hash,
    )

    try:
        db.session.add(user)
        db.session.commit()

        return {
            "success": True,
            "message": "User registered successfully.",
            "user": {
                "user_id": user.user_id,
                "full_name": user.full_name,
                "email": user.email,
                "contact_number": user.contact_number,
                "date_of_joining": user.date_of_joining.isoformat(),
            },
            "status_code": 201,
        }

    except Exception:
        db.session.rollback()
        raise

def login_user(data):
    email = data["email"].strip().lower()
    password = data["password"]

    user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if user is None:
        return {
            "success": False,
            "message": "Invalid email or password.",
            "status_code": 401,
        }

    if not bcrypt.check_password_hash(user.password_hash, password):
        return {
            "success": False,
            "message": "Invalid email or password.",
            "status_code": 401,
        }

    access_token = create_access_token(identity=str(user.user_id))

    return {
        "success": True,
        "message": "Login successful.",
        "access_token": access_token,
        "user": {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
        },
        "status_code": 200,
    }