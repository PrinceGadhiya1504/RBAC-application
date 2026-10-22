from sqlalchemy.exc import IntegrityError
from config.database import db
from models.permission import Permission

def get_all_permissions():
    permissions = Permission.query.order_by(
        Permission.permission_id
    ).all()

    return {
        "success": True,
        "permissions": [
            {
                "permission_id": permission.permission_id,
                "name": permission.name
            }
            for permission in permissions
        ]
    }, 200

def get_permission_by_id(permission_id):
    permission = db.session.get(Permission, permission_id)

    if permission is None:
        return {
            "success": False,
            "message": "Permission not found."
        }, 404

    return {
        "success": True,
        "permission": {
            "permission_id": permission.permission_id,
            "name": permission.name
        }
    }, 200

def create_permission(data):
    name = data["name"].strip()

    existing_permission = Permission.query.filter(
        db.func.lower(Permission.name) == name.lower()
    ).first()

    if existing_permission:
        return {
            "success": False,
            "message": "Permission already exists."
        }, 409

    try:
        permission = Permission(name=name)

        db.session.add(permission)
        db.session.commit()

        return {
            "success": True,
            "message": "Permission created successfully.",
            "permission": {
                "permission_id": permission.permission_id,
                "name": permission.name
            }
        }, 201

    except IntegrityError:
        db.session.rollback()

        return {
            "success": False,
            "message": "Permission already exists."
        }, 409

    except Exception:
        db.session.rollback()
        raise


def update_permission(permission_id, data):
    permission = db.session.get(Permission, permission_id)

    if permission is None:
        return {
            "success": False,
            "message": "Permission not found."
        }, 404

    name = data["name"].strip()

    existing_permission = Permission.query.filter(db.func.lower(Permission.name) == name.lower(), Permission.permission_id != permission_id).first()

    if existing_permission:
        return {
            "success": False,
            "message": "Permission name already exists."
        }, 409

    try:
        permission.name = name
        db.session.commit()

        return {
            "success": True,
            "message": "Permission updated successfully.",
            "permission": {
                "permission_id": permission.permission_id,
                "name": permission.name
            }
        }, 200

    except IntegrityError:
        db.session.rollback()

        return {
            "success": False,
            "message": "Permission name already exists."
        }, 409

    except Exception:
        db.session.rollback()
        raise

def delete_permission(permission_id):
    permission = db.session.get(Permission, permission_id)

    if permission is None:
        return {
            "success": False,
            "message": "Permission not found."
        }, 404

    try:
        db.session.delete(permission)
        db.session.commit()

        return {
            "success": True,
            "message": "Permission deleted successfully."
        }, 200

    except Exception:
        db.session.rollback()
        raise