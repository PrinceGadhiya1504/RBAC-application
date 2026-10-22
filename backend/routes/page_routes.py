from controllers.page_controller import get_all_pages_controller, get_page_by_id_controller, create_page_controller, update_page_controller, delete_page_controller
from flask import Blueprint
from utils.decorators import role_required

page_blueprint = Blueprint("page", __name__, url_prefix="/api/pages")

@page_blueprint.route("/", methods=["GET"])
@role_required("Admin")
def get_all_pages():
    return get_all_pages_controller()

@page_blueprint.route("/<int:page_id>", methods=["GET"])
@role_required("Admin")
def get_page_by_id(page_id):
    return get_page_by_id_controller(page_id)

@page_blueprint.route("/", methods=["POST"])
@role_required("Admin")
def create_page():
    return create_page_controller()


@page_blueprint.route("/<int:page_id>", methods=["PUT"])
@role_required("Admin")
def update_page(page_id):
    return update_page_controller(page_id)

@page_blueprint.route("/<int:page_id>", methods=["DELETE"])
@role_required("Admin")
def delete_page(page_id):
    return delete_page_controller(page_id)
