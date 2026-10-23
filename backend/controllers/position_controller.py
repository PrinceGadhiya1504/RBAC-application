from flask import request
from schemas.position_schema import validate_position_data
from services.position_service import create_position,get_all_positions,get_position_by_id,update_position,delete_position

def create_position_controller():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return {
            "success": False,
            "message": "Request body must be a valid JSON object."
        }, 400

    errors = validate_position_data(data)

    if errors:
        return {
            "success": False,
            "message": "Validation failed.",
            "errors": errors
        }, 400

    return create_position(data)

def get_all_positions_controller():
    return get_all_positions()

def get_position_by_id_controller(position_id):
    return get_position_by_id(position_id)

def update_position_controller(position_id):
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return {
            "success": False,
            "message": "Request body must be a valid JSON object."
        }, 400

    errors = validate_position_data(data)

    if errors:
        return {
            "success": False,
            "message": "Validation failed.",
            "errors": errors
        }, 400

    return update_position(position_id, data)

def delete_position_controller(position_id):
    return delete_position(position_id)
