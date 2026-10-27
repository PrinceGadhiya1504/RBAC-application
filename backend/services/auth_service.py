from datetime import date
from flask_bcrypt import Bcrypt
from sqlalchemy import select
from config.database import db
from models.user import User
from models.role import Role
from models.user_role import UserRole
from models.page import Page
from models.permission import Permission
from models.page_permission import PagePermission
from models.role_page_permission import RolePagePermission
from flask_jwt_extended import create_access_token

bcrypt = Bcrypt()

def get_user_roles_and_permissions(user_id: int):
    role = (
        db.session.query(Role.name)
        .join(UserRole, UserRole.role_id == Role.role_id)
        .filter(UserRole.user_id == user_id)
        .first()
    )
    role_name = role[0] if role else None
    user_roles = [role_name] if role_name else []

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

def register_user(data):
    email = data["email"].strip().lower()

    existing_user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if existing_user:
        return {
            "success": False,
            "message": "Email is already registered.",
            "status_code": 409,
        }

    password_hash = bcrypt.generate_password_hash(
        data["password"]
    ).decode("utf-8")

    joining_date = date.today()
    if data.get("date_of_joining"):
        try:
            joining_date = date.fromisoformat(data["date_of_joining"])
        except ValueError:
            joining_date = date.today()

    user = User(
        full_name = data["full_name"].strip(),
        email = email.lower(),
        contact_number = (
            data.get("contact_number", "").strip() or None
        ),
        date_of_joining = joining_date,
        password_hash = password_hash,
    )

    try:
        db.session.add(user)
        db.session.commit()

        return {
            "success": True,
            "message": "User registered successfully.",
            "user": {
                "user_id": user.user_id,
                "full_name": user.full_name,
                "email": user.email,
                "contact_number": user.contact_number,
                "date_of_joining": user.date_of_joining.isoformat(),
            },
            "status_code": 201,
        }

    except Exception:
        db.session.rollback()
        raise

def login_user(data):
    email = data["email"].strip().lower()
    password = data["password"]

    user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if user is None:
        return {
            "success": False,
            "message": "Invalid email or password.",
            "status_code": 401,
        }

    if not bcrypt.check_password_hash(user.password_hash, password):
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