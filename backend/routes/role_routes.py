from utils.decorators import role_required
from flask import Blueprint
from controllers.role_controller import create_role_controller, get_all_roles_controller, get_role_by_id_controller, update_role_controller, delete_role_controller

role_blueprint = Blueprint("roles", __name__, url_prefix="/api/roles")

@role_blueprint.route("/", methods=["GET"])
def get_roles_route():
    return get_all_roles_controller()

@role_blueprint.route("/<int:role_id>", methods=["GET"])
def get_role_by_id_route(role_id):
    return get_role_by_id_controller(role_id)

@role_blueprint.route("/", methods=["POST"])
@role_required("Admin")
def create_role_route():
    return create_role_controller()

@role_blueprint.route("/<int:role_id>", methods=["PUT"])
@role_required("Admin")
def update_role_route(role_id):
    return update_role_controller(role_id)

@role_blueprint.route("/<int:role_id>", methods=["DELETE"])
@role_required("Admin")
def delete_role_route(role_id):
    return delete_role_controller(role_id)

