from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from config.database import db
from models.role import Role

def get_all_roles():
    roles = db.session.execute(select(Role).order_by(Role.role_id)).scalars().all()

    return [
        {
            "role_id": role.role_id,
            "name": role.name,
            "description": role.description
        }
        for role in roles
    ]

def get_role_by_id(role_id):
    role = db.session.get(Role, role_id)

    if not role:
        return None
    
    return {
        "role_id": role.role_id,
        "name": role.name,
        "description": role.description
    }

def create_role(data):
    name = data["name"].strip()
    description = data.get("description")

    if description is not None:
        description = description.strip() or None

    existing_role = db.session.execute(
        select(Role).where(Role.name.ilike(name))
    ).scalar_one_or_none()

    if existing_role:
        return {
            "success": False,
            "message": "Role name already exists."
        }, 409

    role = Role(
        name = name,
        description = description
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
                "description": role.description
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
        return None

    if "name" in data:
        name = data["name"].strip()

        existing_role = db.session.execute(
            select(Role).where(
                Role.name.ilike(name),
                Role.role_id != role_id
            )
        ).scalar_one_or_none()

        if existing_role:
            return {
                "success": False,
                "message": "Role name already exists."
            }, 409

        role.name = name

    if "description" in data:
        description = data["description"]

        if description is not None:
            description = description.strip() or None

        role.description = description

    try:
        db.session.commit()

        return {
            "success": True,
            "message": "Role updated successfully.",
            "role": {
                "role_id": role.role_id,
                "name": role.name,
                "description": role.description
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

    except Exception:
        db.session.rollback()
        raise
