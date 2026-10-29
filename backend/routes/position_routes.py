from flask import Blueprint
from controllers.position_controller import create_position_controller, get_all_positions_controller, get_position_by_id_controller, update_position_controller, delete_position_controller
from utils.decorators import page_permission_required

position_blueprint = Blueprint("position", __name__, url_prefix="/api/positions")

@position_blueprint.route("", methods=["POST"])
@position_blueprint.route("/", methods=["POST"])
@page_permission_required("Positions", "Create")
def create_position():
    return create_position_controller()


@position_blueprint.route("", methods=["GET"])
@position_blueprint.route("/", methods=["GET"])
@page_permission_required("Positions", "Read")
def get_all_positions():
    return get_all_positions_controller()


@position_blueprint.route("/<int:position_id>", methods=["GET"])
@page_permission_required("Positions", "Read")
def get_position_by_id(position_id):
    return get_position_by_id_controller(position_id)


@position_blueprint.route("/<int:position_id>", methods=["PUT"])
@page_permission_required("Positions", "Update")
def update_position(position_id):
    return update_position_controller(position_id)


@position_blueprint.route("/<int:position_id>", methods=["DELETE"])
@page_permission_required("Positions", "Delete")
def delete_position(position_id):
    return delete_position_controller(position_id)
