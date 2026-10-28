from flask import request, jsonify
from schemas.role_page_permission_schema import validate_role_page_permission_data
from services.role_page_permission_service import (
    assign_permission_to_role,
    bulk_assign_permissions_to_role,
    get_all_role_page_permissions,
    get_role_page_permissions,
    update_role_page_permission,
    delete_role_page_permission,
)

def assign_permission_to_role_controller():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Request body must be a valid JSON object."
        }), 400

    if "permissions" in data and isinstance(data["permissions"], list):
        if not data.get("role_id"):
            return jsonify({
                "success": False,
                "message": "role_id is required."
            }), 400
        try:
            response, status_code = bulk_assign_permissions_to_role(data)
            return jsonify(response), status_code
        except Exception:
            import traceback
            traceback.print_exc()
            return jsonify({
                "success": False,
                "message": "An internal server error occurred."
            }), 500

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

def get_all_role_page_permissions_controller():
    try:
        response, status_code = get_all_role_page_permissions()
        return jsonify(response), status_code

    except Exception:
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

def update_role_page_permission_controller(role_page_permission_id):
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Request body must be valid JSON."
        }), 400

    errors = validate_role_page_permission_data(data)

    if errors:
        return jsonify({
            "success": False,
            "message": "Validation failed.",
            "errors": errors
        }), 400

    if "is_given" not in data:
        return jsonify({
            "success": False,
            "message": "Validation failed.",
            "errors": {
                "is_given": "is_given is required and must be a boolean."
            }
        }), 400

    try:
        response, status_code = update_role_page_permission(
            role_page_permission_id, data
        )
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500


def delete_role_page_permission_controller(role_page_permission_id):
    try:
        response, status_code = delete_role_page_permission(
            role_page_permission_id
        )
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500