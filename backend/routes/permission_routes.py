from flask import Blueprint
from controllers.permission_controller import create_permission_controller, get_all_permissions_controller, get_permission_by_id_controller, update_permission_controller, delete_permission_controller
from utils.decorators import role_required

permission_blueprint = Blueprint("permission", __name__, url_prefix="/api/permissions")

@permission_blueprint.route("", methods=["GET"])
@role_required("Admin")
def get_all_permissions():
    return get_all_permissions_controller()

@permission_blueprint.route("/<int:permission_id>", methods=["GET"])
@role_required("Admin")
def get_permission_by_id(permission_id):
    return get_permission_by_id_controller(permission_id)

@permission_blueprint.route("", methods=["POST"])
@role_required("Admin")
def create_permission():
    return create_permission_controller()

@permission_blueprint.route("/<int:permission_id>", methods=["PUT"])
@role_required("Admin")
def update_permission(permission_id):
    return update_permission_controller(permission_id)

@permission_blueprint.route("/<int:permission_id>", methods=["DELETE"])
@role_required("Admin")
def delete_permission(permission_id):
    return delete_permission_controller(permission_id)