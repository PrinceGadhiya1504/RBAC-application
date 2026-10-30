from flask import request
from schemas.page_schema import validate_page_data
from services.page_service import get_all_pages, get_page_by_id, create_page, update_page, delete_page

def get_all_pages_controller():
    return get_all_pages()

def get_page_by_id_controller(page_id):
    return get_page_by_id(page_id)

def create_page_controller():
    data = request.get_json(silent=True)

    error = validate_page_data(data)
    if error:
        return {
            "success": False,
            "message": error
        }, 400

    return create_page(data)

def update_page_controller(page_id):
    data = request.get_json(silent=True)

    error = validate_page_data(data)
    if error:
        return {
            "success": False,
            "message": error
        }, 400

    return update_page(page_id, data)

def delete_page_controller(page_id):
    return delete_page(page_id)