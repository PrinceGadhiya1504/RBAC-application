from flask import Blueprint
from controllers.auth_controller import login, get_profile

auth_blueprint = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_blueprint.route("/login", methods=["POST"])
def login_route():
    return login()

@auth_blueprint.route("/profile", methods=["GET"])
def profile_route():
    return get_profile()