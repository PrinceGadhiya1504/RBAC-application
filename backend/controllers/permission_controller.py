from flask import request, jsonify
from schemas.permission_schema import validate_permission_data
from services.permission_service import create_permission, get_all_permissions, get_permission_by_id, update_permission, delete_permission

def get_all_permissions_controller():
    try:
        response, status_code = get_all_permissions()
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def get_permission_by_id_controller(permission_id):
    try:
        response, status_code = get_permission_by_id(permission_id)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def create_permission_controller():
    data = request.get_json(silent=True)

    error = validate_permission_data(data)
    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    try:
        response, status_code = create_permission(data)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def update_permission_controller(permission_id):
    data = request.get_json(silent=True)

    error = validate_permission_data(data)
    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    try:
        response, status_code = update_permission(permission_id, data)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def delete_permission_controller(permission_id):
    try:
        response, status_code = delete_permission(permission_id)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500
