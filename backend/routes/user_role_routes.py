from utils.decorators import role_required
from flask import Blueprint
from controllers.user_role_controller import get_user_roles_controller, assign_role_controller, remove_role_from_user_controller

user_role_blueprint = Blueprint("user_roles", __name__, url_prefix="/api/user-roles")

@user_role_blueprint.route("/<int:user_id>", methods=["GET"])
def get_user_roles_route(user_id):
    return get_user_roles_controller(user_id)

@user_role_blueprint.route("/", methods=["POST"])
@role_required("Admin")
def assign_role_route():
    return assign_role_controller()

@user_role_blueprint.route("/<int:user_id>/<int:role_id>", methods=["DELETE"])
@role_required("Admin")
def remove_role_from_user_route(user_id, role_id):
    return remove_role_from_user_controller(user_id, role_id)