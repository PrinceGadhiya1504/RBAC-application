from flask import request, jsonify
from schemas.user_role_schema import validate_user_role_data
from services.user_role_service import assign_role_to_user, get_all_user_roles, get_user_roles, remove_role_from_user, update_user_role

def assign_role_controller():
    data = request.get_json(silent=True)

    error = validate_user_role_data(data)
    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    try:
        response, status_code = assign_role_to_user(data)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def get_all_user_roles_controller():
    try:
        response, status_code = get_all_user_roles()
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def get_user_roles_controller(user_id):
    try:
        response, status_code = get_user_roles(user_id)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def update_user_role_controller(user_role_id):
    data = request.get_json(silent=True)

    error = validate_user_role_data(data)
    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    try:
        response, status_code = update_user_role(
            user_role_id,
            data
        )
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def remove_role_from_user_controller(user_id, role_id=None):
    try:
        response, status_code = remove_role_from_user(user_id, role_id)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500