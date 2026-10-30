from flask import request, jsonify
from schemas.role_schema import validate_role_data, validate_update_role_data
from services.role_service import get_all_roles, create_role, get_role_by_id, update_role, delete_role

def get_all_roles_controller():
    try:
        roles = get_all_roles()
        return jsonify({
            "success": True,
            "message": "Roles fetched successfully.",
            "roles": roles
        }), 200

    except Exception:
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def get_role_by_id_controller(role_id):
    try:
        role = get_role_by_id(role_id)

        if role is None:
            return jsonify({
                "success": False,
                "message": "Role not found."
            }), 404

        return jsonify({
            "success": True,
            "role": role
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500


def create_role_controller():
    data = request.get_json(silent=True)

    error = validate_role_data(data)
    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    try:
        response, status_code = create_role(data)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def update_role_controller(role_id):
    data = request.get_json(silent=True)

    error = validate_update_role_data(data)
    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    try:
        response, status_code = update_role(role_id, data)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def delete_role_controller(role_id):
    try:
        response, status_code = delete_role(role_id)

        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500