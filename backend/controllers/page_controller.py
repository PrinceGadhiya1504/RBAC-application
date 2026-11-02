from flask import request, jsonify
from schemas.page_schema import validate_page_data
from services.page_service import get_all_pages, get_page_by_id, create_page, update_page, delete_page

def get_all_pages_controller():
    try:
        response, status_code = get_all_pages()
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def get_page_by_id_controller(page_id):
    try:
        response, status_code = get_page_by_id(page_id)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def create_page_controller():
    data = request.get_json(silent=True)

    error = validate_page_data(data)
    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    try:
        response, status_code = create_page(data)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def update_page_controller(page_id):
    data = request.get_json(silent=True)

    error = validate_page_data(data)
    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    try:
        response, status_code = update_page(page_id, data)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500

def delete_page_controller(page_id):
    try:
        response, status_code = delete_page(page_id)
        return jsonify(response), status_code

    except Exception:
        return jsonify({
            "success": False,
            "message": "An internal server error occurred."
        }), 500