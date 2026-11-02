from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError
from config.database import db
from models.role import Role
from models.user_role import UserRole

def get_all_roles():
    member_counts = dict(
        db.session.query(
            UserRole.role_id, func.count(UserRole.user_role_id)
        ).group_by(UserRole.role_id).all()
    )

    roles = db.session.execute(select(Role).order_by(Role.role_id)).scalars().all()

    return {
        "success": True,
        "roles": [
            {
                "role_id": role.role_id,
                "name": role.name,
                "description": role.description,
                "member_count": member_counts.get(role.role_id, 0),
            }
            for role in roles
        ]
    }, 200

def get_role_by_id(role_id):
    role = db.session.get(Role, role_id)

    if not role:
        return {
            "success": False,
            "message": "Role not found."
        }, 404

    count = (
        db.session.query(func.count(UserRole.user_role_id))
        .filter(UserRole.role_id == role_id)
        .scalar()
        or 0
    )

    return {
        "success": True,
        "role": {
            "role_id": role.role_id,
            "name": role.name,
            "description": role.description,
            "member_count": count,
        }
    }, 200

def create_role(data):
    name = data["name"].strip()
    description = data.get("description")

    if description is not None:
        description = description.strip() or None

    role = Role(
        name=name,
        description=description
    )

    try:
        db.session.add(role)
        db.session.commit()

        return {
            "success": True,
            "message": "Role created successfully.",
            "role": {
                "role_id": role.role_id,
                "name": role.name,
                "description": role.description,
                "member_count": 0,
            }
        }, 201

    except IntegrityError:
        db.session.rollback()
        return {
            "success": False,
            "message": "Role name already exists."
        }, 409

    except Exception:
        db.session.rollback()
        raise

def update_role(role_id, data):
    role = db.session.get(Role, role_id)

    if not role:
        return {
            "success": False,
            "message": "Role not found."
        }, 404

    if "name" in data:
        role.name = data["name"].strip()

    if "description" in data:
        description = data["description"]
        role.description = description.strip() or None if description is not None else None

    try:
        db.session.commit()

        count = (
            db.session.query(func.count(UserRole.user_role_id))
            .filter(UserRole.role_id == role.role_id)
            .scalar()
            or 0
        )

        return {
            "success": True,
            "message": "Role updated successfully.",
            "role": {
                "role_id": role.role_id,
                "name": role.name,
                "description": role.description,
                "member_count": count,
            }
        }, 200

    except IntegrityError:
        db.session.rollback()
        return {
            "success": False,
            "message": "Role name already exists."
        }, 409

    except Exception:
        db.session.rollback()
        raise

def delete_role(role_id):
    role = db.session.get(Role, role_id)

    if role is None:
        return {
            "success": False,
            "message": "Role not found."
        }, 404

    try:
        db.session.delete(role)
        db.session.commit()

        return {
            "success": True,
            "message": "Role deleted successfully."
        }, 200

    except IntegrityError:
        db.session.rollback()
        return {
            "success": False,
            "message": "Cannot delete role because related records exist."
        }, 409

    except Exception:
        db.session.rollback()
        raise