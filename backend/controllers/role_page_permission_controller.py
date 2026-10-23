from flask import request, jsonify
from schemas.role_page_permission_schema import validate_role_page_permission_data
from services.role_page_permission_service import assign_permission_to_role, get_role_page_permissions

def assign_permission_to_role_controller():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Request body must be a valid JSON object."
        }), 400

    errors = validate_role_page_permission_data(data)

    if errors:
        return jsonify({
            "success": False,
            "message": "Validation failed.",
            "errors": errors
        }), 400

    try:
        response, status_code = assign_permission_to_role(data)
        return jsonify(response), status_code
    except Exception:
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def get_role_page_permissions_controller(role_id):
    try:
        response, status_code = get_role_page_permissions(role_id)
        return jsonify(response), status_code
    except Exception:
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500
