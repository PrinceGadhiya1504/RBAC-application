from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from config.database import db
from models.user import User
from models.role import Role
from models.user_role import UserRole

def get_all_user_roles():
    assignments = db.session.execute(select(UserRole).order_by(UserRole.user_role_id)).scalars().all()

    user_roles = []

    for assignment in assignments:
        user = db.session.get(User, assignment.user_id)
        role = db.session.get(Role, assignment.role_id)

        user_roles.append({
            "user_role_id": assignment.user_role_id,
            "user_id": assignment.user_id,
            "user_name": user.full_name if user else None,
            "role_id": assignment.role_id,
            "role_name": role.name if role else None
        })

    return {
        "success": True,
        "user_roles": user_roles
    }, 200

def get_user_roles(user_id):
    user = db.session.get(User, user_id)

    if user is None:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    assignments = db.session.execute(
        select(UserRole).where(
            UserRole.user_id == user_id
        )
    ).scalars().all()

    roles = []

    for assignment in assignments:
        role = db.session.get(Role, assignment.role_id)
        if role:
            roles.append({
                "role_id": role.role_id,
                "name": role.name,
                "description": role.description
            })

    return {
        "success": True,
        "user": {
            "user_id": user.user_id,
            "full_name": user.full_name
        },
        "roles": roles
    }, 200
    
def assign_role_to_user(data):
    user_id = data["user_id"]
    role_id = data["role_id"]

    user = db.session.get(User, user_id)

    if user is None:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    role = db.session.get(Role, role_id)

    if role is None:
        return {
            "success": False,
            "message": "Role not found."
        }, 404

    existing_assignment = db.session.execute(
        select(UserRole).where(
            UserRole.user_id == user_id,
            UserRole.role_id == role_id
        )
    ).scalar_one_or_none()

    if existing_assignment:
        return {
            "success": False,
            "message": "Role is already assigned to this user."
        }, 409

    assignment = UserRole(
        user_id = user_id,
        role_id = role_id
    )

    try:
        db.session.add(assignment)
        db.session.commit()

        return {
            "success": True,
            "message": "Role assigned successfully.",
            "assignment": {
                "user_role_id": assignment.user_role_id,
                "user_id": user.user_id,
                "user_name": user.full_name,
                "role_id": role.role_id,
                "role_name": role.name
            }
        }, 201

    except IntegrityError:
        db.session.rollback()

        return {
            "success": False,
            "message": "This role is already assigned to the user."
        }, 409

    except Exception:
        db.session.rollback()
        raise

def update_user_role(user_role_id, data):
    assignment = db.session.get(UserRole, user_role_id)

    if assignment is None:
        return {
            "success": False,
            "message": "User role assignment not found."
        }, 404

    user_id = data["user_id"]
    role_id = data["role_id"]

    user = db.session.get(User, user_id)

    if user is None:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    role = db.session.get(Role, role_id)

    if role is None:
        return {
            "success": False,
            "message": "Role not found."
        }, 404

    existing_assignment = db.session.execute(select(UserRole).where(
            UserRole.user_id == user_id,
            UserRole.role_id == role_id,
            UserRole.user_role_id != user_role_id
        )).scalar_one_or_none()

    if existing_assignment:
        return {
            "success": False,
            "message": "Role is already assigned to this user."
        }, 409

    try:
        assignment.user_id = user_id
        assignment.role_id = role_id

        db.session.commit()

        return {
            "success": True,
            "message": "User role updated successfully.",
            "assignment": {
                "user_role_id": assignment.user_role_id,
                "user_id": user.user_id,
                "user_name": user.full_name,
                "role_id": role.role_id,
                "role_name": role.name
            }
        }, 200

    except IntegrityError:
        db.session.rollback()

        return {
            "success": False,
            "message": "This role is already assigned to the user."
        }, 409

    except Exception:
        db.session.rollback()
        raise

def remove_role_from_user(user_id, role_id):
    user = db.session.get(User, user_id)

    if user is None:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    role = db.session.get(Role, role_id)

    if role is None:
        return {
            "success": False,
            "message": "Role not found."
        }, 404

    assignment = db.session.execute(
        select(UserRole).where(
            UserRole.user_id == user_id,
            UserRole.role_id == role_id
        )
    ).scalar_one_or_none()

    if assignment is None:
        return {
            "success": False,
            "message": "This role is not assigned to the user."
        }, 404

    try:
        db.session.delete(assignment)
        db.session.commit()

        return {
            "success": True,
            "message": "Role removed from user successfully."
        }, 200

    except Exception:
        db.session.rollback()
        raise