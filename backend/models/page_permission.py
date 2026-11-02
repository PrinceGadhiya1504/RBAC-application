from config.database import db
from models.base import AuditBase

class PagePermission(AuditBase):
    __tablename__ = "page_permissions"

    page_permission_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    page_id = db.Column(db.Integer, db.ForeignKey("pages.page_id", ondelete="CASCADE"), nullable=False)
    permission_id = db.Column(db.Integer, db.ForeignKey("permissions.permission_id", ondelete="CASCADE"), nullable=False)

    __table_args__ = (db.UniqueConstraint("page_id", "permission_id", name="unique_page_permissions"),)