from flask import request, jsonify
from schemas.auth_schema import validate_register_data, validate_login_data
from services.auth_service import register_user, login_user
from flask_jwt_extended import jwt_required, get_jwt_identity
from config.database import db
from models.user import User

def register():
    data = request.get_json(silent=True)

    errors = validate_register_data(data)

    if errors:
        return jsonify({
            "success": False,
            "message": "Validation failed.",
            "errors": errors,
        }), 400

    try:
        result = register_user(data)

        status_code = result.pop("status_code")

        return jsonify(result), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An unexpected error occurred.",
        }), 500

def login():
    data = request.get_json(silent=True)

    errors = validate_login_data(data)

    if errors:
        return jsonify({
            "success": False,
            "message": "Validation failed.",
            "errors": errors,
        }), 400

    try:
        result = login_user(data)
        status_code = result.pop("status_code")

        return jsonify(result), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An unexpected error occurred.",
        }), 500

@jwt_required()
def get_profile():
    user_id = get_jwt_identity()

    user = db.session.get(User, int(user_id))

    if user is None:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Profile fetched successfully.",
        "user": {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
            "contact_number": user.contact_number,
            "date_of_joining": user.date_of_joining.isoformat()
        }
    }), 200