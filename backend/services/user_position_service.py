from datetime import date
from sqlalchemy.exc import IntegrityError
from config.database import db
from models.user import User
from models.position import Position
from models.user_position import UserPosition

def assign_position_to_user(data):
    user = db.session.get(User, data["user_id"])

    if not user:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    position = db.session.get(Position, data["position_id"])

    if not position:
        return {
            "success": False,
            "message": "Position not found."
        }, 404

    start_date = date.fromisoformat(data["start_date"])
    end_date = (date.fromisoformat(data["end_date"]) if data.get("end_date") is not None else None)

    try:
        user_position = UserPosition(
            user_id = data["user_id"],
            position_id = data["position_id"],
            start_date = start_date,
            end_date = end_date
        )

        db.session.add(user_position)
        db.session.commit()

        return {
            "success": True,
            "message": "Position assigned to user successfully.",
            "user_position": {
                "user_position_id": user_position.user_position_id,
                "user_id": user_position.user_id,
                "position_id": user_position.position_id,
                "start_date": user_position.start_date.isoformat(),
                "end_date": (user_position.end_date.isoformat() if user_position.end_date else None)
            }
        }, 201

    except IntegrityError:
        db.session.rollback()
        return {
            "success": False,
            "message": "Unable to assign position due to a database constraint."
        }, 400

    except Exception:
        db.session.rollback()
        raise

def get_user_positions(user_id):
    user = db.session.get(User, user_id)

    if not user:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    assignments = (UserPosition.query.filter_by(user_id=user_id).order_by(UserPosition.user_position_id).all())

    return {
        "success": True,
        "user_positions": [
            {
                "user_position_id": item.user_position_id,
                "user_id": item.user_id,
                "position_id": item.position_id,
                "position_name": (
                    db.session.get(Position, item.position_id).name
                    if db.session.get(Position, item.position_id)
                    else None
                ),
                "start_date": item.start_date.isoformat(),
                "end_date": (
                    item.end_date.isoformat()
                    if item.end_date
                    else None
                )
            }
            for item in assignments
        ]
    }, 200


def update_user_position(user_position_id, data):
    user_position = db.session.get(UserPosition, user_position_id)

    if not user_position:
        return {
            "success": False,
            "message": "User position assignment not found."
        }, 404

    user_id = data.get("user_id", user_position.user_id)
    position_id = data.get("position_id", user_position.position_id)
    start_date_value = data.get(
        "start_date",
        user_position.start_date.isoformat()
    )
    end_date_value = data.get(
        "end_date",
        user_position.end_date.isoformat()
        if user_position.end_date
        else None
    )

    user = db.session.get(User, user_id)

    if not user:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    position = db.session.get(Position, position_id)

    if not position:
        return {
            "success": False,
            "message": "Position not found."
        }, 404

    user_position.user_id = user_id
    user_position.position_id = position_id
    user_position.start_date = date.fromisoformat(start_date_value)
    user_position.end_date = (
        date.fromisoformat(end_date_value)
        if end_date_value is not None
        else None
    )

    try:
        db.session.commit()

        return {
            "success": True,
            "message": "User position updated successfully.",
            "user_position": {
                "user_position_id": user_position.user_position_id,
                "user_id": user_position.user_id,
                "position_id": user_position.position_id,
                "start_date": user_position.start_date.isoformat(),
                "end_date": (
                    user_position.end_date.isoformat()
                    if user_position.end_date
                    else None
                )
            }
        }, 200

    except IntegrityError:
        db.session.rollback()
        return {
            "success": False,
            "message": "Unable to update user position due to a database constraint."
        }, 400

    except Exception:
        db.session.rollback()
        raise

def delete_user_position(user_position_id):
    user_position = db.session.get(UserPosition, user_position_id)

    if not user_position:
        return {
            "success": False,
            "message": "User position assignment not found."
        }, 404

    db.session.delete(user_position)
    db.session.commit()

    return {
        "success": True,
        "message": "User position assignment deleted successfully."
    }, 200
