from datetime import date
from sqlalchemy import select
from config.database import db
from models.user import User
from models.role import Role
from models.user_role import UserRole
from models.position import Position
from models.user_position import UserPosition

def get_all_users():
    users = db.session.execute(select(User).order_by(User.user_id)).scalars().all()

    user_roles = {
        ur.user_id: (role.role_id, role.name)
        for ur, role in db.session.query(UserRole, Role).join(Role, UserRole.role_id == Role.role_id).all()
    }

    user_positions = {}
    for up, pos in db.session.query(UserPosition, Position).join(Position, UserPosition.position_id == Position.position_id).order_by(UserPosition.user_position_id.asc()).all():
        user_positions[up.user_id] = (pos.position_id, pos.name)

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
            ),
            "role_id": user_roles[user.user_id][0] if user.user_id in user_roles else None,
            "role_name": user_roles[user.user_id][1] if user.user_id in user_roles else None,
            "position_id": user_positions[user.user_id][0] if user.user_id in user_positions else None,
            "position_name": user_positions[user.user_id][1] if user.user_id in user_positions else None,
        }
        for user in users
    ]

def get_user_by_id(user_id):
    user = db.session.get(User, user_id)

    if not user:
        return None

    ur_assignment = db.session.query(UserRole, Role).join(Role, UserRole.role_id == Role.role_id).filter(UserRole.user_id == user_id).first()
    up_assignment = db.session.query(UserPosition, Position).join(Position, UserPosition.position_id == Position.position_id).filter(UserPosition.user_id == user_id).order_by(UserPosition.user_position_id.desc()).first()

    return {
        "user_id": user.user_id,
        "full_name": user.full_name,
        "email": user.email,
        "contact_number": user.contact_number,
        "date_of_joining": (
            user.date_of_joining.isoformat()
            if user.date_of_joining
            else None
        ),
        "role_id": ur_assignment[1].role_id if ur_assignment else None,
        "role_name": ur_assignment[1].name if ur_assignment else None,
        "position_id": up_assignment[1].position_id if up_assignment else None,
        "position_name": up_assignment[1].name if up_assignment else None,
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

    if "role_id" in data:
        role_id = data["role_id"]
        ur = UserRole.query.filter_by(user_id=user_id).first()
        if role_id:
            role = db.session.get(Role, role_id)
            if not role:
                return {"success": False, "message": "Role not found."}, 404
            if ur:
                ur.role_id = role_id
            else:
                db.session.add(UserRole(user_id=user_id, role_id=role_id))
        elif ur:
            db.session.delete(ur)

    if "position_id" in data:
        position_id = data["position_id"]
        up = UserPosition.query.filter_by(user_id=user_id).order_by(UserPosition.user_position_id.desc()).first()
        if position_id:
            pos = db.session.get(Position, position_id)
            if not pos:
                return {"success": False, "message": "Position not found."}, 404
            if up:
                up.position_id = position_id
            else:
                db.session.add(UserPosition(
                    user_id=user_id,
                    position_id=position_id,
                    start_date=user.date_of_joining or date.today()
                ))
        elif up:
            db.session.delete(up)

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