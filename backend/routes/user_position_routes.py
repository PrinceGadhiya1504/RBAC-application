from flask import Blueprint
from controllers.user_position_controller import assign_position_to_user_controller,get_all_user_positions_controller, get_user_positions_controller, update_user_position_controller, delete_user_position_controller
from utils.decorators import role_required

user_position_blueprint = Blueprint("user_position_blueprint", __name__, url_prefix="/api/user-positions")

@user_position_blueprint.route("/", methods=["POST"])
@role_required("Admin")
def assign_position_to_user():
    return assign_position_to_user_controller()

@user_position_blueprint.route("/", methods=["GET"])
@role_required("Admin")
def get_all_user_positions_route():
    return get_all_user_positions_controller()

@user_position_blueprint.route("/user/<int:user_id>", methods=["GET"])
@role_required("Admin")
def get_user_positions(user_id):
    return get_user_positions_controller(user_id)

@user_position_blueprint.route("/<int:user_position_id>", methods=["PUT"])
@role_required("Admin")
def update_user_position(user_position_id):
    return update_user_position_controller(user_position_id)

@user_position_blueprint.route("/<int:user_position_id>", methods=["DELETE"])
@role_required("Admin")
def delete_user_position(user_position_id):
    return delete_user_position_controller(user_position_id)