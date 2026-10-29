from utils.decorators import page_permission_required
from flask import Blueprint
from controllers.user_role_controller import get_all_user_roles_controller, get_user_roles_controller, assign_role_controller, update_user_role_controller, remove_role_from_user_controller

user_role_blueprint = Blueprint("user_roles", __name__, url_prefix="/api/user-roles")

@user_role_blueprint.route("/", methods=["GET"])
@page_permission_required("Roles", "Read")
def get_all_user_roles_route():
    return get_all_user_roles_controller()

@user_role_blueprint.route("/<int:user_id>", methods=["GET"])
@page_permission_required("Roles", "Read")
def get_user_roles_route(user_id):
    return get_user_roles_controller(user_id)

@user_role_blueprint.route("/", methods=["POST"])
@page_permission_required("Roles", "Create")
def assign_role_route():
    return assign_role_controller()

@user_role_blueprint.route("/<int:user_role_id>", methods=["PUT"])
@page_permission_required("Roles", "Update")
def update_user_role_route(user_role_id):
    return update_user_role_controller(user_role_id)

@user_role_blueprint.route("/<int:user_id>", methods=["DELETE"])
@page_permission_required("Roles", "Delete")
def remove_user_role_route(user_id):
    return remove_role_from_user_controller(user_id)

@user_role_blueprint.route("/<int:user_id>/<int:role_id>", methods=["DELETE"])
@page_permission_required("Roles", "Delete")
def remove_role_from_user_route(user_id, role_id):
    return remove_role_from_user_controller(user_id, role_id)