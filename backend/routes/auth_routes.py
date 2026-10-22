from flask import Blueprint
from controllers.auth_controller import register, login, get_profile

auth_blueprint = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_blueprint.route("/register", methods=["POST"])
def register_route():
    return register()

@auth_blueprint.route("/login", methods=["POST"])
def login_route():
    return login()

@auth_blueprint.route("/profile", methods=["GET"])
def profile_route():
    return get_profile()