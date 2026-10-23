from sqlalchemy.exc import IntegrityError
from config.database import db
from models.page_permission import PagePermission
from models.page import Page
from models.permission import Permission


def assign_permission_to_page(data):
    page_id = data["page_id"]
    permission_id = data["permission_id"]

    page = db.session.get(Page, page_id)

    if page is None:
        return {
            "success": False,
            "message": "Page not found."
        }, 404

    permission = db.session.get(Permission, permission_id)

    if permission is None:
        return {
            "success": False,
            "message": "Permission not found."
        }, 404

    existing_mapping = PagePermission.query.filter_by(page_id=page_id,permission_id=permission_id).first()

    if existing_mapping:
        return {
            "success": False,
            "message": "Permission is already assigned to this page."
        }, 409

    try:
        mapping = PagePermission(
            page_id = page_id,
            permission_id = permission_id
        )

        db.session.add(mapping)
        db.session.commit()

        return {
            "success": True,
            "message": "Permission assigned to page successfully.",
            "page_permission": {
                "page_permission_id": mapping.page_permission_id,
                "page_id": page.page_id,
                "page_name": page.name,
                "permission_id": permission.permission_id,
                "permission_name": permission.name
            }
        }, 201

    except IntegrityError:
        db.session.rollback()

        return {
            "success": False,
            "message": "Permission is already assigned to this page."
        }, 409

    except Exception:
        db.session.rollback()
        raise

def get_all_page_permissions():
    results = (
        db.session.query(PagePermission, Page, Permission)
        .join(Page, PagePermission.page_id == Page.page_id)
        .join(Permission, PagePermission.permission_id == Permission.permission_id)
        .order_by(PagePermission.page_permission_id)
        .all()
    )

    return {
        "success": True,
        "page_permissions": [
            {
                "page_permission_id": mapping.page_permission_id,
                "page_id": page.page_id,
                "page_name": page.name,
                "permission_id": permission.permission_id,
                "permission_name": permission.name
            }
            for mapping, page, permission in results
        ]
    }, 200

def get_page_permissions(page_id):
    page = db.session.get(Page, page_id)

    if page is None:
        return {
            "success": False,
            "message": "Page not found."
        }, 404

    results = (
        db.session.query(PagePermission, Permission)
        .join(Permission, PagePermission.permission_id == Permission.permission_id)
        .filter(PagePermission.page_id == page_id)
        .order_by(PagePermission.page_permission_id)
        .all()
    )

    return {
        "success": True,
        "page": {
            "page_id": page.page_id,
            "name": page.name
        },
        "permissions": [
            {
                "page_permission_id": mapping.page_permission_id,
                "permission_id": permission.permission_id,
                "permission_name": permission.name
            }
            for mapping, permission in results
        ]
    }, 200


def update_page_permission(page_permission_id, data):
    mapping = db.session.get(PagePermission, page_permission_id)

    if mapping is None:
        return {
            "success": False,
            "message": "Page permission mapping not found."
        }, 404

    page_id = data["page_id"]
    permission_id = data["permission_id"]

    page = db.session.get(Page, page_id)

    if page is None:
        return {
            "success": False,
            "message": "Page not found."
        }, 404

    permission = db.session.get(Permission, permission_id)

    if permission is None:
        return {
            "success": False,
            "message": "Permission not found."
        }, 404

    existing_mapping = PagePermission.query.filter(
        PagePermission.page_id == page_id,
        PagePermission.permission_id == permission_id,
        PagePermission.page_permission_id != page_permission_id
    ).first()

    if existing_mapping:
        return {
            "success": False,
            "message": "Permission is already assigned to this page."
        }, 409

    try:
        mapping.page_id = page_id
        mapping.permission_id = permission_id

        db.session.commit()

        return {
            "success": True,
            "message": "Page permission updated successfully.",
            "page_permission": {
                "page_permission_id": mapping.page_permission_id,
                "page_id": page.page_id,
                "page_name": page.name,
                "permission_id": permission.permission_id,
                "permission_name": permission.name
            }
        }, 200

    except IntegrityError:
        db.session.rollback()
        return {
            "success": False,
            "message": "Permission is already assigned to this page."
        }, 409

    except Exception:
        db.session.rollback()
        raise

def delete_page_permission(page_permission_id):
    mapping = db.session.get(PagePermission, page_permission_id)

    if mapping is None:
        return {
            "success": False,
            "message": "Page permission mapping not found."
        }, 404

    try:
        db.session.delete(mapping)
        db.session.commit()

        return {
            "success": True,
            "message": "Page permission deleted successfully."
        }, 200

    except Exception:
        db.session.rollback()
        raise