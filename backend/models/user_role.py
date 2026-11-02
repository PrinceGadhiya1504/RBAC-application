from config.database import db
from models.base import AuditBase

class UserRole(AuditBase):
    __tablename__ = "user_roles"

    user_role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.role_id", ondelete="CASCADE"), nullable=False)

    __table_args__ = (db.UniqueConstraint("user_id", "role_id", name="unique_user_roles"),)