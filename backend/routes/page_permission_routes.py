from flask import Blueprint
from controllers.page_permission_controller import assign_permission_to_page_controller,get_all_page_permissions_controller, get_page_permissions_controller, update_page_permission_controller, delete_page_permission_controller
from utils.decorators import page_permission_required

page_permission_blueprint = Blueprint("page_permission",__name__,url_prefix="/api/page-permissions")

@page_permission_blueprint.route("", methods=["POST"])
@page_permission_required("Permissions", "Create")
def assign_permission_to_page():
    return assign_permission_to_page_controller()

@page_permission_blueprint.route("/", methods=["GET"])
@page_permission_required("Permissions", "Read")
def get_all_page_permissions_route():
    return get_all_page_permissions_controller()

@page_permission_blueprint.route("/<int:page_id>", methods=["GET"])
@page_permission_required("Permissions", "Read")
def get_page_permissions(page_id):
    return get_page_permissions_controller(page_id)

@page_permission_blueprint.route("/<int:page_permission_id>", methods=["PUT"])
@page_permission_required("Permissions", "Update")
def update_page_permission(page_permission_id):
    return update_page_permission_controller(page_permission_id)

@page_permission_blueprint.route("/<int:page_permission_id>", methods=["DELETE"])
@page_permission_required("Permissions", "Delete")
def delete_page_permission(page_permission_id):
    return delete_page_permission_controller(page_permission_id)