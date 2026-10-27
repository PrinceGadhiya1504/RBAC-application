from config.database import db

class UserRole(db.Model):
    __tablename__ = "user_roles"

    user_role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.role_id", ondelete="CASCADE"), nullable=False)

    # Prevent the same role from being assigned to the same user more than once.
    # The trailing comma (,) is required to create a single-element tuple.
    # Without the comma, this would be a UniqueConstraint object, not a tuple.
    __table_args__ = (db.UniqueConstraint("user_id", "role_id", name="unique_user_role"),)