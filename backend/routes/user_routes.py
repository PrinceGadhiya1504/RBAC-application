from flask import Blueprint
from controllers.user_controller import get_all_users_controller, get_user_by_id_controller, create_user_controller, update_user_controller, delete_user_controller
from utils.decorators import page_permission_required

user_blueprint = Blueprint("users", __name__, url_prefix="/api/users")

@user_blueprint.route("", methods=["GET"])
@page_permission_required("Users", "Read")
def get_all_users_route():
    return get_all_users_controller()

@user_blueprint.route("/<int:user_id>", methods=["GET"])
@page_permission_required("Users", "Read")
def get_user_by_id_route(user_id):
    return get_user_by_id_controller(user_id)

@user_blueprint.route("", methods=["POST"])
@page_permission_required("Users", "Create")
def create_user_route():
    return create_user_controller()

@user_blueprint.route("/<int:user_id>", methods=["PUT"])
@page_permission_required("Users", "Update")
def update_user_route(user_id):
    return update_user_controller(user_id)

@user_blueprint.route("/<int:user_id>", methods=["DELETE"])
@page_permission_required("Users", "Delete")
def delete_user_route(user_id):
    return delete_user_controller(user_id)