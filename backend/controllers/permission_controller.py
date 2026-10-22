from flask import request
from schemas.permission_schema import validate_permission_data
from services.permission_service import create_permission, get_all_permissions, get_permission_by_id, update_permission, delete_permission

def get_all_permissions_controller():
    return get_all_permissions()

def get_permission_by_id_controller(permission_id):
    return get_permission_by_id(permission_id)

def create_permission_controller():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return {
            "success": False,
            "message": "Request body must be a valid JSON object."
        }, 400

    errors = validate_permission_data(data)

    if errors:
        return {
            "success": False,
            "message": "Validation failed.",
            "errors": errors
        }, 400

    return create_permission(data)

def update_permission_controller(permission_id):
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return {
            "success": False,
            "message": "Request body must be a valid JSON object."
        }, 400

    errors = validate_permission_data(data)

    if errors:
        return {
            "success": False,
            "message": "Validation failed.",
            "errors": errors
        }, 400

    return update_permission(permission_id, data)

def delete_permission_controller(permission_id):
    return delete_permission(permission_id)
