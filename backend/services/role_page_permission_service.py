from sqlalchemy.exc import IntegrityError
from config.database import db
from models.role_page_permission import RolePagePermission
from models.role import Role
from models.page_permission import PagePermission
from models.page import Page
from models.permission import Permission

def assign_permission_to_role(data):
    role_id = data["role_id"]
    page_permission_id = data["page_permission_id"]
    is_given = data.get("is_given", False)

    role = db.session.get(Role, role_id)

    if not role:
        return {
            "success": False,
            "message": "Role not found."
        }, 404

    page_permission = db.session.get(
        PagePermission,
        page_permission_id
    )

    if not page_permission:
        return {
            "success": False,
            "message": "Page permission not found."
        }, 404

    mapping = db.session.query(RolePagePermission).filter_by(
        role_id=role_id,
        page_permission_id=page_permission_id
    ).first()

    if mapping:
        mapping.is_given = is_given
        try:
            db.session.commit()
            return {
                "success": True,
                "message": "Role permission updated successfully.",
                "role_page_permission": {
                    "role_page_permission_id": mapping.role_page_permission_id,
                    "role_id": role.role_id,
                    "page_permission_id": page_permission.page_permission_id,
                    "page_id": page_permission.page_id,
                    "permission_id": page_permission.permission_id,
                    "is_given": mapping.is_given
                }
            }, 200
        except Exception:
            db.session.rollback()
            raise

    try:
        mapping = RolePagePermission(
            role_id = role_id,
            page_permission_id = page_permission_id,
            is_given = is_given
        )

        db.session.add(mapping)
        db.session.commit()

        return {
            "success": True,
            "message": "Permission assigned to role successfully.",
            "role_page_permission": {
                "role_page_permission_id": mapping.role_page_permission_id,
                "role_id": role.role_id,
                "page_permission_id": page_permission.page_permission_id,
                "page_id": page_permission.page_id,
                "permission_id": page_permission.permission_id,
                "is_given": mapping.is_given
            }
        }, 201

    except IntegrityError:
        db.session.rollback()
        return {
            "success": False,
            "message": "Permission mapping already exists."
        }, 409

    except Exception:
        db.session.rollback()
        raise


def bulk_assign_permissions_to_role(data):
    role_id = data.get("role_id")
    permissions_list = data.get("permissions", [])

    role = db.session.get(Role, role_id)
    if not role:
        return {
            "success": False,
            "message": "Role not found."
        }, 404

    try:
        for item in permissions_list:
            page_permission_id = item.get("page_permission_id")
            is_given = item.get("is_given", False)

            if not page_permission_id:
                continue

            page_permission = db.session.get(PagePermission, page_permission_id)
            if not page_permission:
                continue

            mapping = db.session.query(RolePagePermission).filter_by(
                role_id=role_id,
                page_permission_id=page_permission_id
            ).first()

            if mapping:
                mapping.is_given = is_given
            else:
                mapping = RolePagePermission(
                    role_id=role_id,
                    page_permission_id=page_permission_id,
                    is_given=is_given
                )
                db.session.add(mapping)

        db.session.commit()
        return {
            "success": True,
            "message": "Permissions updated successfully."
        }, 200

    except Exception:
        db.session.rollback()
        raise


def get_all_role_page_permissions():
    mappings = (
        db.session.query(
            RolePagePermission,
            Role,
            PagePermission,
            Page,
            Permission
        )
        .join(
            Role,
            RolePagePermission.role_id == Role.role_id
        )
        .join(
            PagePermission,
            RolePagePermission.page_permission_id
            == PagePermission.page_permission_id
        )
        .join(
            Page,
            PagePermission.page_id == Page.page_id
        )
        .join(
            Permission,
            PagePermission.permission_id == Permission.permission_id
        )
        .order_by(RolePagePermission.role_page_permission_id)
        .all()
    )

    return {
        "success": True,
        "role_page_permissions": [
            {
                "role_page_permission_id": mapping.role_page_permission_id,
                "role_id": role.role_id,
                "role_name": role.name,
                "page_permission_id": page_permission.page_permission_id,
                "page_id": page.page_id,
                "page_name": page.name,
                "permission_id": permission.permission_id,
                "permission_name": permission.name,
                "is_given": mapping.is_given
            }
            for mapping, role, page_permission, page, permission in mappings
        ]
    }, 200

def get_role_page_permissions(role_id):
    role = db.session.get(Role, role_id)

    if not role:
        return {
            "success": False,
            "message": "Role not found."
        }, 404

    mappings = (
        db.session.query(
            RolePagePermission,
            PagePermission,
            Page,
            Permission
        )
        .join(
            PagePermission,
            RolePagePermission.page_permission_id
            == PagePermission.page_permission_id
        )
        .join(
            Page,
            PagePermission.page_id == Page.page_id
        )
        .join(
            Permission,
            PagePermission.permission_id
            == Permission.permission_id
        )
        .filter(RolePagePermission.role_id == role_id)
        .order_by(RolePagePermission.role_page_permission_id)
        .all()
    )

    return {
        "success": True,
        "role": {
            "role_id": role.role_id,
            "name": role.name
        },
        "permissions": [
            {
                "role_page_permission_id": mapping.role_page_permission_id,
                "page_permission_id": page_permission.page_permission_id,
                "page_id": page.page_id,
                "page_name": page.name,
                "permission_id": permission.permission_id,
                "permission_name": permission.name,
                "is_given": mapping.is_given
            }
            for mapping, page_permission, page, permission in mappings
        ]
    }, 200

def update_role_page_permission(role_page_permission_id, data):
    mapping = db.session.get(RolePagePermission,role_page_permission_id)

    if mapping is None:
        return {
            "success": False,
            "message": "Role page permission mapping not found."
        }, 404

    role_id = data["role_id"]
    page_permission_id = data["page_permission_id"]
    is_given = data["is_given"]

    role = db.session.get(Role, role_id)

    if role is None:
        return {
            "success": False,
            "message": "Role not found."
        }, 404

    page_permission = db.session.get(
        PagePermission,
        page_permission_id
    )

    if page_permission is None:
        return {
            "success": False,
            "message": "Page permission not found."
        }, 404

    existing_mapping = RolePagePermission.query.filter(
        RolePagePermission.role_id == role_id,
        RolePagePermission.page_permission_id == page_permission_id,
        RolePagePermission.role_page_permission_id
        != role_page_permission_id
    ).first()

    if existing_mapping:
        return {
            "success": False,
            "message": "Permission is already assigned to this role."
        }, 409

    try:
        mapping.role_id = role_id
        mapping.page_permission_id = page_permission_id
        mapping.is_given = is_given

        db.session.commit()

        return {
            "success": True,
            "message": "Role page permission updated successfully.",
            "role_page_permission": {
                "role_page_permission_id": mapping.role_page_permission_id,
                "role_id": role.role_id,
                "page_permission_id": page_permission.page_permission_id,
                "page_id": page_permission.page_id,
                "permission_id": page_permission.permission_id,
                "is_given": mapping.is_given
            }
        }, 200

    except IntegrityError:
        db.session.rollback()
        return {
            "success": False,
            "message": "Permission is already assigned to this role."
        }, 409

    except Exception:
        db.session.rollback()
        raise


def delete_role_page_permission(role_page_permission_id):
    mapping = db.session.get(
        RolePagePermission,
        role_page_permission_id
    )

    if mapping is None:
        return {
            "success": False,
            "message": "Role page permission mapping not found."
        }, 404

    try:
        db.session.delete(mapping)
        db.session.commit()

        return {
            "success": True,
            "message": "Role page permission deleted successfully."
        }, 200

    except Exception:
        db.session.rollback()
        raise