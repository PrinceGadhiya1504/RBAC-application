
from flask import request
from schemas.page_permission_schema import validate_page_permission_data
from services.page_permission_service import assign_permission_to_page, get_page_permissions

def assign_permission_to_page_controller():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return {
            "success": False,
            "message": "Request body must be a valid JSON object."
        }, 400

    errors = validate_page_permission_data(data)

    if errors:
        return {
            "success": False,
            "message": "Validation failed.",
            "errors": errors
        }, 400

    return assign_permission_to_page(data)


def get_page_permissions_controller(page_id):
    return get_page_permissions(page_id)
