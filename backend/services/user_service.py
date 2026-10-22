from sqlalchemy import select
from config.database import db
from models.user import User
from datetime import date

def get_all_users():
    users = db.session.execute(select(User).order_by(User.user_id)).scalars().all()

    return [
        {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
            "contact_number": user.contact_number,
            "date_of_joining": (
                user.date_of_joining.isoformat()
                if user.date_of_joining
                else None
            )
        }
        for user in users
    ]

def get_user_by_id(user_id):
    user = db.session.get(User, user_id)

    if not user:
        return None

    return {
        "user_id": user.user_id,
        "full_name": user.full_name,
        "email": user.email,
        "contact_number": user.contact_number,
        "date_of_joining": (
            user.date_of_joining.isoformat()
            if user.date_of_joining
            else None
        )
    }

def update_user(user_id, data):
    user = db.session.get(User, user_id)

    if user is None:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    if "full_name" in data:
        user.full_name = data["full_name"].strip()

    if "email" in data:
        user.email = data["email"].strip().lower()

    if "contact_number" in data:
        user.contact_number = data["contact_number"]

    if "date_of_joining" in data:
        user.date_of_joining = date.fromisoformat(
            data["date_of_joining"]
        )

    try:
        db.session.commit()

        return {
            "success": True,
            "message": "User updated successfully."
        }, 200

    except Exception:
        db.session.rollback()
        raise


def delete_user(user_id):
    user = db.session.get(User, user_id)

    if user is None:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    try:
        db.session.delete(user)
        db.session.commit()

        return {
            "success": True,
            "message": "User deleted successfully."
        }, 200

    except Exception:
        db.session.rollback()
        raise