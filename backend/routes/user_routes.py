from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from controllers.user_controller import (
    get_all_users_controller,
    get_user_by_id_controller,
    create_user_controller,
    update_user_controller,
    delete_user_controller,
)
from utils.decorators import page_permission_required, check_user_page_permission

user_blueprint = Blueprint("users", __name__, url_prefix="/api/users")

@user_blueprint.route("", methods=["GET"])
@page_permission_required("Users", "Read")
def get_all_users_route():
    return get_all_users_controller()

@user_blueprint.route("/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user_by_id_route(user_id):
    current_user_id = int(get_jwt_identity())
    if current_user_id != user_id and not check_user_page_permission(current_user_id, "Users", "Read"):
        return jsonify({
            "success": False,
            "message": "You do not have READ access to the Users module."
        }), 403
    return get_user_by_id_controller(user_id)

@user_blueprint.route("", methods=["POST"])
@page_permission_required("Users", "Create")
def create_user_route():
    return create_user_controller()

RESTRICTED_USER_FIELDS = {"date_of_joining", "end_date", "role_id", "position_id"}

@user_blueprint.route("/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user_route(user_id):
    current_user_id = int(get_jwt_identity())
    has_update_perm = check_user_page_permission(current_user_id, "Users", "Update")

    # If updating another user, must have Users.Update permission
    if current_user_id != user_id and not has_update_perm:
        return jsonify({
            "success": False,
            "message": "You do not have UPDATE access to the Users module."
        }), 403

    # If updating own profile without Users.Update permission, enforce restricted fields check
    if not has_update_perm:
        data = request.get_json(silent=True) or {}
        attempted = RESTRICTED_USER_FIELDS.intersection(data)
        if attempted:
            return jsonify({
                "success": False,
                "message": f"You do not have permission to update restricted fields: {', '.join(sorted(attempted))}."
            }), 403

    return update_user_controller(user_id)

@user_blueprint.route("/<int:user_id>", methods=["DELETE"])
@page_permission_required("Users", "Delete")
def delete_user_route(user_id):
    return delete_user_controller(user_id)