from flask import Blueprint
from controllers.user_controller import get_all_users_controller, get_user_by_id_controller, update_user_controller, delete_user_controller
from utils.decorators import role_required

user_blueprint = Blueprint("users", __name__, url_prefix="/api/users")

@user_blueprint.route("", methods=["GET"])
@role_required("Admin")
def get_all_users_route():
    return get_all_users_controller()

@user_blueprint.route("/<int:user_id>", methods=["GET"])
@role_required("Admin")
def get_user_by_id_route(user_id):
    return get_user_by_id_controller(user_id)

@user_blueprint.route("/<int:user_id>", methods=["PUT"])
@role_required("Admin")
def update_user_route(user_id):
    return update_user_controller(user_id)

@user_blueprint.route("/<int:user_id>", methods=["DELETE"])
@role_required("Admin")
def delete_user_route(user_id):
    return delete_user_controller(user_id)