from flask_bcrypt import Bcrypt
from sqlalchemy import select
from config.database import db
from models.user import User
from models.role import Role
from models.user_role import UserRole
from models.position import Position
from models.user_position import UserPosition
from models.page import Page
from models.permission import Permission
from models.page_permission import PagePermission
from models.role_page_permission import RolePagePermission
from flask_jwt_extended import create_access_token

bcrypt = Bcrypt()

def get_user_roles_and_permissions(user_id: int):
    role_records = (
        db.session.query(Role.name)
        .join(UserRole, UserRole.role_id == Role.role_id)
        .filter(UserRole.user_id == user_id)
        .all()
    )
    user_roles = [r[0] for r in role_records]
    role_name = user_roles[0] if user_roles else None

    granted = (
        db.session.query(Page.name, Permission.name)
        .join(PagePermission, PagePermission.page_id == Page.page_id)
        .join(Permission, Permission.permission_id == PagePermission.permission_id)
        .join(
            RolePagePermission,
            RolePagePermission.page_permission_id == PagePermission.page_permission_id,
        )
        .join(UserRole, UserRole.role_id == RolePagePermission.role_id)
        .filter(
            UserRole.user_id == user_id,
            RolePagePermission.is_given.is_(True),
        )
        .distinct()
        .all()
    )

    permissions_map = {}
    for page_name, perm_name in granted:
        if page_name not in permissions_map:
            permissions_map[page_name] = []
        if perm_name not in permissions_map[page_name]:
            permissions_map[page_name].append(perm_name)

    return role_name, user_roles, permissions_map

def login_user(data):
    email = data["email"].strip().lower()
    password = data["password"]

    user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if user is None or not bcrypt.check_password_hash(user.password_hash, password):
        return {
            "success": False,
            "message": "Invalid email or password.",
            "status_code": 401,
        }

    access_token = create_access_token(identity=str(user.user_id))
    role_name, user_roles, permissions_map = get_user_roles_and_permissions(user.user_id)

    return {
        "success": True,
        "message": "Login successful.",
        "access_token": access_token,
        "user": {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
            "role": role_name,
            "roles": user_roles,
            "permissions": permissions_map,
        },
        "status_code": 200,
    }

def get_user_profile(user_id: int):
    user = db.session.get(User, user_id)
    if user is None:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    role_name, user_roles, permissions_map = get_user_roles_and_permissions(user.user_id)

    position_records = (
        db.session.query(UserPosition, Position)
        .join(Position, UserPosition.position_id == Position.position_id)
        .filter(UserPosition.user_id == user_id)
        .order_by(UserPosition.start_date.desc(), UserPosition.user_position_id.desc())
        .all()
    )

    position_history = [
        {
            "user_position_id": up.user_position_id,
            "position_id": pos.position_id,
            "position_name": pos.name,
            "start_date": up.start_date.isoformat() if up.start_date else None,
            "end_date": up.end_date.isoformat() if up.end_date else None,
            "is_current": up.end_date is None,
        }
        for up, pos in position_records
    ]

    current_position = next((item for item in position_history if item["is_current"]), None)
    if not current_position and position_history:
        current_position = position_history[0]

    return {
        "success": True,
        "message": "Profile fetched successfully.",
        "user": {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
            "contact_number": user.contact_number,
            "date_of_joining": user.date_of_joining.isoformat() if user.date_of_joining else None,
            "end_date": current_position["end_date"] if current_position else None,
            "role": role_name,
            "roles": user_roles,
            "role_name": role_name,
            "position_id": current_position["position_id"] if current_position else None,
            "position_name": current_position["position_name"] if current_position else None,
            "position_history": position_history,
            "permissions": permissions_map,
        }
    }, 200