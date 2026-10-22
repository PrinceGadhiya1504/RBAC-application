from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from config.database import db
from models.user_role import UserRole
from models.role import Role

def role_required(*allowed_roles):
    def decorator(func):
        @wraps(func)
        @jwt_required()
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()

            assignments = db.session.query(
                Role.name
            ).join(
                UserRole,
                UserRole.role_id == Role.role_id
            ).filter(
                UserRole.user_id == int(user_id)
            ).all()

            user_roles = [role_name for (role_name,) in assignments]

            if not any(role in user_roles for role in allowed_roles):
                return jsonify({
                    "success": False,
                    "message": "You do not have permission to access this resource."
                }), 403

            return func(*args, **kwargs)

        return wrapper
    return decorator
