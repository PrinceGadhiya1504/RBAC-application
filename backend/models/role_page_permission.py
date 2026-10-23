from config.database import db

class RolePagePermission(db.Model):
    __tablename__ = "role_page_permissions"
    
    role_page_permission_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.role_id", ondelete="CASCADE"), nullable=False)
    page_permission_id = db.Column(db.Integer, db.ForeignKey("page_permissions.page_permission_id", ondelete="CASCADE"), nullable=False)
    is_given = db.Column(db.Boolean, nullable=False, default=False)

    __table_args__ = (db.UniqueConstraint("role_id", "page_permission_id", name="role_page_permission_unique"),)