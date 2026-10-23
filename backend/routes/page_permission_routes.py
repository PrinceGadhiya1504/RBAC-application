from flask import Blueprint
from controllers.page_permission_controller import assign_permission_to_page_controller,get_all_page_permissions_controller, get_page_permissions_controller, update_page_permission_controller, delete_page_permission_controller
from utils.decorators import role_required

page_permission_blueprint = Blueprint("page_permission",__name__,url_prefix="/api/page-permissions")

@page_permission_blueprint.route("", methods=["POST"])
@role_required("Admin")
def assign_permission_to_page():
    return assign_permission_to_page_controller()

@page_permission_blueprint.route("/", methods=["GET"])
@role_required("Admin")
def get_all_page_permissions_route():
    return get_all_page_permissions_controller()

@page_permission_blueprint.route("/<int:page_id>", methods=["GET"])
@role_required("Admin")
def get_page_permissions(page_id):
    return get_page_permissions_controller(page_id)

@page_permission_blueprint.route("/<int:page_permission_id>", methods=["PUT"])
@role_required("Admin")
def update_page_permission(page_permission_id):
    return update_page_permission_controller(page_permission_id)

@page_permission_blueprint.route("/<int:page_permission_id>", methods=["DELETE"])
@role_required("Admin")
def delete_page_permission(page_permission_id):
    return delete_page_permission_controller(page_permission_id)