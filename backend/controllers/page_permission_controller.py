from flask import request, jsonify
from schemas.page_permission_schema import validate_page_permission_data
from services.page_permission_service import assign_permission_to_page, get_all_page_permissions, get_page_permissions, update_page_permission, delete_page_permission

def assign_permission_to_page_controller():
    data = request.get_json(silent=True)

    error = validate_page_permission_data(data)
    if error:
        return {
            "success": False,
            "message": error
        }, 400

    return assign_permission_to_page(data)

def get_all_page_permissions_controller():
    try:
        response, status_code = get_all_page_permissions()
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def get_page_permissions_controller(page_id):
    return get_page_permissions(page_id)

def update_page_permission_controller(page_permission_id):
    data = request.get_json(silent=True)

    error = validate_page_permission_data(data)
    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    try:
        response, status_code = update_page_permission(page_permission_id, data)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def delete_page_permission_controller(page_permission_id):
    try:
        response, status_code = delete_page_permission(page_permission_id)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500