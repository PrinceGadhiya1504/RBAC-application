from sqlalchemy.exc import IntegrityError
from config.database import db
from models.page import Page

def get_all_pages():
    pages = Page.query.order_by(Page.page_id).all()

    return {
        "success": True,
        "pages": [
            {
                "page_id": page.page_id,
                "name": page.name
            }
            for page in pages
        ]
    }, 200


def get_page_by_id(page_id):
    page = db.session.get(Page, page_id)

    if page is None:
        return {
            "success": False,
            "message": "Page not found."
        }, 404

    return {
        "success": True,
        "page": {
            "page_id": page.page_id,
            "name": page.name
        }
    }, 200


def create_page(data):
    name = data["name"].strip()

    existing_page = Page.query.filter(db.func.lower(Page.name) == name.lower()).first()

    if existing_page:
        return {
            "success": False,
            "message": "Page already exists."
        }, 409

    try:
        page = Page(name = name)
        db.session.add(page)
        db.session.commit()

        return {
            "success": True,
            "message": "Page created successfully.",
            "page": {
                "page_id": page.page_id,
                "name": page.name
            }
        }, 201
    
    except IntegrityError:
        db.session.rollback()

        return {
            "success": False,
            "message": "Page already exists."
        }, 409

    except Exception:
        db.session.rollback()
        raise


def update_page(page_id, data):
    page = db.session.get(Page, page_id)

    if page is None:
        return {
            "success": False,
            "message": "Page not found."
        }, 404

    name = data["name"].strip()

    existing_page = Page.query.filter(
        db.func.lower(Page.name) == name.lower(),
        Page.page_id != page_id
    ).first()

    if existing_page:
        return {
            "success": False,
            "message": "Page name already exists."
        }, 409

    try:
        page.name = name
        db.session.commit()

        return {
            "success": True,
            "message": "Page updated successfully.",
            "page": {
                "page_id": page.page_id,
                "name": page.name
            }
        }, 200

    except IntegrityError:
        db.session.rollback()

        return {
            "success": False,
            "message": "Page name already exists."
        }, 409

    except Exception:
        db.session.rollback()
        raise


def delete_page(page_id):
    page = db.session.get(Page, page_id)

    if page is None:
        return {
            "success": False,
            "message": "Page not found."
        }, 404

    try:
        db.session.delete(page)
        db.session.commit()

        return {
            "success": True,
            "message": "Page deleted successfully."
        }, 200

    except Exception:
        db.session.rollback()
        raise