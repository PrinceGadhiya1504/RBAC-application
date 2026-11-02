from flask import request, jsonify
from schemas.position_schema import validate_position_data
from services.position_service import create_position, get_all_positions, get_position_by_id, update_position, delete_position

def create_position_controller():
    data = request.get_json(silent=True)

    error = validate_position_data(data)
    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    try:
        response, status_code = create_position(data)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def get_all_positions_controller():
    try:
        response, status_code = get_all_positions()
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def get_position_by_id_controller(position_id):
    try:
        response, status_code = get_position_by_id(position_id)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def update_position_controller(position_id):
    data = request.get_json(silent=True)

    error = validate_position_data(data)
    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    try:
        response, status_code = update_position(position_id, data)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def delete_position_controller(position_id):
    try:
        response, status_code = delete_position(position_id)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500
