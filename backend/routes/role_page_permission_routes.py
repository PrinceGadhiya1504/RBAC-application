from flask import Blueprint
from controllers.role_page_permission_controller import assign_permission_to_role_controller, get_role_page_permissions_controller
from utils.decorators import role_required

role_page_permission_blueprint = Blueprint("role_page_permission", __name__, url_prefix="/api/role-page-permissions")

@role_page_permission_blueprint.route("/", methods=["POST"])
@role_required("Admin")
def assign_permission_to_role_route():
    return assign_permission_to_role_controller()

@role_page_permission_blueprint.route("/<int:role_id>", methods=["GET"])
@role_required("Admin")
def get_role_page_permissions_route(role_id):
    return get_role_page_permissions_controller(role_id)