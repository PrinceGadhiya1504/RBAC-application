from flask import Blueprint
from controllers.page_permission_controller import assign_permission_to_page_controller, get_page_permissions_controller
from utils.decorators import role_required

page_permission_blueprint = Blueprint("page_permission",__name__,url_prefix="/api/page-permissions")

@page_permission_blueprint.route("", methods=["POST"])
@role_required("Admin")
def assign_permission_to_page():
    return assign_permission_to_page_controller()

@page_permission_blueprint.route("/<int:page_id>", methods=["GET"])
@role_required("Admin")
def get_page_permissions(page_id):
    return get_page_permissions_controller(page_id)