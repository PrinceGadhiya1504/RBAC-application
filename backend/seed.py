import os
from datetime import date
from flask_bcrypt import Bcrypt
from config.database import db
from app import app
from models.page import Page
from models.permission import Permission
from models.page_permission import PagePermission
from models.role import Role
from models.role_page_permission import RolePagePermission
from models.position import Position
from models.user import User
from models.user_role import UserRole
from models.user_position import UserPosition

bcrypt = Bcrypt()

PREDEFINED_PAGES = ["Users", "Roles", "Permissions", "Positions"]

PREDEFINED_PERMISSIONS = ["Create", "Read", "Update", "Delete"]

PREDEFINED_ROLES = [
    {"name": "Admin", "description": "Full system administrator access"},
    {"name": "Employee", "description": "Standard employee access with view permissions"},
]

PREDEFINED_POSITIONS = [
    {"name": "Software Engineer", "description": "Responsible for developing and maintaining software applications."},
    {"name": "Product Manager", "description": "Responsible for product strategy, roadmap, and feature definitions."},
    {"name": "HR Specialist", "description": "Manages employee relations, benefits, and onboarding."},
    {"name": "Team Lead", "description": "Leads engineering team delivery and technical direction."},
]

DEFAULT_ADMIN = {
    "full_name": os.getenv("DEFAULT_ADMIN_NAME", "System Administrator"),
    "email": os.getenv("DEFAULT_ADMIN_EMAIL", "admin@gmail.com").strip().lower(),
    "password": os.getenv("DEFAULT_ADMIN_PASSWORD", "Admin@123"),
    "contact_number": os.getenv("DEFAULT_ADMIN_PHONE", "9874561230"),
}

def seed_database():
    with app.app_context():
        print("--- Starting RBAC Seeder ---")

        # 1. Seed Predefined Pages
        page_map = {}
        for page_name in PREDEFINED_PAGES:
            page = Page.query.filter_by(name=page_name).first()
            if not page:
                page = Page(name=page_name)
                db.session.add(page)
                db.session.flush()
                print(f"Created page: {page_name}")
            else:
                print(f"Page already exists: {page_name}")
            page_map[page_name] = page

        # 2. Seed Predefined Permissions
        perm_map = {}
        for perm_name in PREDEFINED_PERMISSIONS:
            perm = Permission.query.filter_by(name=perm_name).first()
            if not perm:
                perm = Permission(name=perm_name)
                db.session.add(perm)
                db.session.flush()
                print(f"Created permission: {perm_name}")
            else:
                print(f"Permission already exists: {perm_name}")
            perm_map[perm_name] = perm

        # 3. Seed Page Permissions (all 4 pages x all 4 permissions = 16 mappings)
        page_perm_list = []
        for page_name, page_obj in page_map.items():
            for perm_name, perm_obj in perm_map.items():
                pp = PagePermission.query.filter_by(
                    page_id=page_obj.page_id,
                    permission_id=perm_obj.permission_id
                ).first()
                if not pp:
                    pp = PagePermission(
                        page_id=page_obj.page_id,
                        permission_id=perm_obj.permission_id
                    )
                    db.session.add(pp)
                    db.session.flush()
                    print(f"Created PagePermission: {page_name} -> {perm_name}")
                page_perm_list.append(pp)

        # 4. Seed Roles
        role_map = {}
        for r_data in PREDEFINED_ROLES:
            role = Role.query.filter_by(name=r_data["name"]).first()
            if not role:
                role = Role(name=r_data["name"], description=r_data["description"])
                db.session.add(role)
                db.session.flush()
                print(f"Created role: {r_data['name']}")
            else:
                role_map[r_data["name"]] = role
            role_map[r_data["name"]] = role

        # 5. Seed Positions
        position_map = {}
        for pos_data in PREDEFINED_POSITIONS:
            pos = Position.query.filter_by(name=pos_data["name"]).first()
            if not pos:
                pos = Position(name=pos_data["name"], description=pos_data["description"])
                db.session.add(pos)
                db.session.flush()
                print(f"Created position: {pos_data['name']}")
            else:
                position_map[pos_data["name"]] = pos
            position_map[pos_data["name"]] = pos

        # 6. Seed Role Page Permissions for Admin (Grant all 16 permissions)
        admin_role = role_map.get("Admin")
        if admin_role:
            for pp in page_perm_list:
                rpp = RolePagePermission.query.filter_by(
                    role_id=admin_role.role_id,
                    page_permission_id=pp.page_permission_id
                ).first()
                if not rpp:
                    rpp = RolePagePermission(
                        role_id=admin_role.role_id,
                        page_permission_id=pp.page_permission_id,
                        is_given=True
                    )
                    db.session.add(rpp)
                else:
                    rpp.is_given = True

        # 7. Seed Role Page Permissions for Employee (Grant Read permissions)
        employee_role = role_map.get("Employee")
        read_perm = perm_map.get("Read")
        if employee_role and read_perm:
            for pp in page_perm_list:
                if pp.permission_id == read_perm.permission_id:
                    rpp = RolePagePermission.query.filter_by(
                        role_id=employee_role.role_id,
                        page_permission_id=pp.page_permission_id
                    ).first()
                    if not rpp:
                        rpp = RolePagePermission(
                            role_id=employee_role.role_id,
                            page_permission_id=pp.page_permission_id,
                            is_given=True
                        )
                        db.session.add(rpp)
                    else:
                        rpp.is_given = True

        # 8. Create Default Admin User and assign Admin Role
        admin_email = DEFAULT_ADMIN["email"]
        admin_user = User.query.filter_by(email=admin_email).first()

        if not admin_user:
            password_hash = bcrypt.generate_password_hash(
                DEFAULT_ADMIN["password"]
            ).decode("utf-8")

            admin_user = User(
                full_name=DEFAULT_ADMIN["full_name"],
                email=admin_email,
                contact_number=DEFAULT_ADMIN["contact_number"],
                date_of_joining=date.today(),
                password_hash=password_hash,
            )
            db.session.add(admin_user)
            db.session.flush()
            print(f"Created default admin user: {admin_user.email}")
        else:
            print(f"Default admin user already exists: {admin_user.email}")

        if admin_user and admin_role:
            user_role = UserRole.query.filter_by(user_id=admin_user.user_id).first()
            if not user_role:
                user_role = UserRole(user_id=admin_user.user_id, role_id=admin_role.role_id)
                db.session.add(user_role)
                print(f"Assigned Admin role to: {admin_user.email}")
            else:
                user_role.role_id = admin_role.role_id

        # Assign default Team Lead position if user has no position assigned
        team_lead_pos = position_map.get("Team Lead")
        if admin_user and team_lead_pos:
            user_pos = UserPosition.query.filter_by(user_id=admin_user.user_id).first()
            if not user_pos:
                user_pos = UserPosition(
                    user_id=admin_user.user_id,
                    position_id=team_lead_pos.position_id,
                    start_date=date.today()
                )
                db.session.add(user_pos)
                print(f"Assigned Team Lead position to: {admin_user.email}")

        db.session.commit()
        print("--- Seeder Completed Successfully ---")

if __name__ == "__main__":
    seed_database()