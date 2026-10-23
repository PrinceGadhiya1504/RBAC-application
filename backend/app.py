from flask import Flask, jsonify
from config.settings import Config
from config.database import db
from models.user import User
from routes.auth_routes import auth_blueprint
from routes.role_routes import role_blueprint
from routes.user_role_routes import user_role_blueprint
from routes.user_routes import user_blueprint
from routes.page_routes import page_blueprint
from routes.permission_routes import permission_blueprint
from routes.page_permission_routes import page_permission_blueprint
from routes.role_page_permission_routes import role_page_permission_blueprint
from datetime import timedelta
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config.from_object(Config)

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)
jwt = JWTManager(app)

db.init_app(app)
app.register_blueprint(auth_blueprint)
app.register_blueprint(role_blueprint)
app.register_blueprint(user_role_blueprint)
app.register_blueprint(user_blueprint)
app.register_blueprint(page_blueprint)
app.register_blueprint(permission_blueprint)
app.register_blueprint(page_permission_blueprint)
app.register_blueprint(role_page_permission_blueprint)

@app.route("/api", methods=["GET"])
def health_check():
    return jsonify({
        "success": True,
        "message": "RBAC API is running"
    }), 200

@app.route("/api/test-db", methods=["GET"])
def test_db():
    try:
        user_count = db.session.query(User).count()

        return jsonify({
            "success": True,
            "message": "Database connected successfully",
            "users_count": user_count
        }), 200

    except Exception:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Database query failed"
        }), 500

if __name__ == "__main__":
    app.run(debug=app.config["DEBUG"])
