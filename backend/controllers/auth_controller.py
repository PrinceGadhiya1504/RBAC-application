from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from schemas.auth_schema import validate_login_data
from services.auth_service import login_user, get_user_profile

def login():
    data = request.get_json(silent=True)

    error = validate_login_data(data)
    if error:
        return jsonify({
            "success": False,
            "message": error,
        }), 400

    try:
        result = login_user(data)
        status_code = result.pop("status_code", 200)

        return jsonify(result), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An unexpected error occurred.",
        }), 500

@jwt_required()
def get_profile():
    try:
        user_id = int(get_jwt_identity())
        response, status_code = get_user_profile(user_id)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An unexpected error occurred.",
        }), 500