from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from config.database import db
from models.user_role import UserRole
from models.role import Role
from models.page import Page
from models.permission import Permission
from models.page_permission import PagePermission
from models.role_page_permission import RolePagePermission

def role_required(*allowed_roles):
    def decorator(func):
        @wraps(func)
        @jwt_required()
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()

            roles = db.session.query(
                Role.name
            ).join(
                UserRole,
                UserRole.role_id == Role.role_id
            ).filter(
                UserRole.user_id == int(user_id)
            ).all()

            user_roles = [r[0] for r in roles]

            if not any(role in allowed_roles for role in user_roles):
                return jsonify({
                    "success": False,
                    "message": "You do not have permission to access this resource."
                }), 403

            return func(*args, **kwargs)

        return wrapper
    return decorator

def check_user_page_permission(user_id, page_name, permission_name):
    if not user_id:
        return False

    has_permission = db.session.query(
        RolePagePermission.role_page_permission_id
    ).join(
        UserRole,
        UserRole.role_id == RolePagePermission.role_id
    ).join(
        PagePermission,
        PagePermission.page_permission_id
        == RolePagePermission.page_permission_id
    ).join(
        Page,
        Page.page_id == PagePermission.page_id
    ).join(
        Permission,
        Permission.permission_id == PagePermission.permission_id
    ).filter(
        UserRole.user_id == int(user_id),
        Page.name == page_name,
        Permission.name == permission_name,
        RolePagePermission.is_given.is_(True)
    ).first()

    return has_permission is not None

def page_permission_required(page_name, permission_name):
    def decorator(func):
        @wraps(func)
        @jwt_required()
        def wrapper(*args, **kwargs):
            user_id = int(get_jwt_identity())

            if not check_user_page_permission(user_id, page_name, permission_name):
                return jsonify({
                    "success": False,
                    "message": f"You do not have {permission_name.upper()} access to the {page_name} module."
                }), 403

            return func(*args, **kwargs)

        return wrapper
    return decorator