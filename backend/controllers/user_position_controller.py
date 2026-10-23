from flask import request
from schemas.user_position_schema import validate_user_position_data
from services.user_position_service import assign_position_to_user, get_user_positions, update_user_position, delete_user_position

def assign_position_to_user_controller():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return {
            "success": False,
            "message": "Request body must be a valid JSON object."
        }, 400

    errors = validate_user_position_data(data)

    if errors:
        return {
            "success": False,
            "message": "Validation failed.",
            "errors": errors
        }, 400

    return assign_position_to_user(data)

def get_user_positions_controller(user_id):
    return get_user_positions(user_id)

def update_user_position_controller(user_position_id):
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return {
            "success": False,
            "message": "Request body must be a valid JSON object."
        }, 400

    errors = validate_user_position_data(data)

    if errors:
        return {
            "success": False,
            "message": "Validation failed.",
            "errors": errors
        }, 400

    return update_user_position(user_position_id, data)

def delete_user_position_controller(user_position_id):
    return delete_user_position(user_position_id)
