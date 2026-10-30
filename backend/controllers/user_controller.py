from flask import request, jsonify
from sqlalchemy.exc import IntegrityError
from services.user_service import get_all_users, get_user_by_id, update_user, delete_user
from schemas.user_schema import validate_update_user_data
from services.auth_service import register_user
from schemas.auth_schema import validate_register_data

def get_all_users_controller():
    try:
        users = get_all_users()

        return jsonify({
            "success": True,
            "users": users
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def get_user_by_id_controller(user_id):
    try:
        user = get_user_by_id(user_id)

        if user is None:
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404

        return jsonify({
            "success": True,
            "user": user
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def create_user_controller():
    data = request.get_json(silent=True)

    error = validate_register_data(data)

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    try:
        result = register_user(data)
        status_code = result.pop("status_code")

        return jsonify(result), status_code

    except IntegrityError:
        return jsonify({
            "success": False,
            "message": "Email already exists."
        }), 409

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def update_user_controller(user_id):
    data = request.get_json(silent=True)

    error = validate_update_user_data(data)
    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    try:
        response, status_code = update_user(user_id, data)
        return jsonify(response), status_code

    except Exception as error:
        if isinstance(error, IntegrityError):
            err_str = str(error).lower()
            if "email" in err_str:
                msg = "Email already exists."
            elif "role" in err_str:
                msg = "Role constraint error."
            elif "position" in err_str:
                msg = "Position constraint error."
            else:
                msg = "Database constraint violation."

            return jsonify({
                "success": False,
                "message": msg
            }), 409

        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def delete_user_controller(user_id):
    try:
        response, status_code = delete_user(user_id)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500
