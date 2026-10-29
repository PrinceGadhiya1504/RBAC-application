from flask import Blueprint
from controllers.user_position_controller import assign_position_to_user_controller,get_all_user_positions_controller, get_user_positions_controller, update_user_position_controller, delete_user_position_controller
from utils.decorators import page_permission_required

user_position_blueprint = Blueprint("user_position_blueprint", __name__, url_prefix="/api/user-positions")

@user_position_blueprint.route("/", methods=["POST"])
@page_permission_required("Positions", "Create")
def assign_position_to_user():
    return assign_position_to_user_controller()

@user_position_blueprint.route("/", methods=["GET"])
@page_permission_required("Positions", "Read")
def get_all_user_positions_route():
    return get_all_user_positions_controller()

@user_position_blueprint.route("/user/<int:user_id>", methods=["GET"])
@page_permission_required("Positions", "Read")
def get_user_positions(user_id):
    return get_user_positions_controller(user_id)

@user_position_blueprint.route("/<int:user_position_id>", methods=["PUT"])
@page_permission_required("Positions", "Update")
def update_user_position(user_position_id):
    return update_user_position_controller(user_position_id)

@user_position_blueprint.route("/<int:user_position_id>", methods=["DELETE"])
@page_permission_required("Positions", "Delete")
def delete_user_position(user_position_id):
    return delete_user_position_controller(user_position_id)