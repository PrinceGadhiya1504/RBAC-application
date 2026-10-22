from sqlalchemy import UniqueConstraint
from config.database import db

class PagePermission(db.Model):
    __tablename__ = "page_permissions"

    page_permission_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    page_id = db.Column(db.Integer, db.ForeignKey("pages.page_id", ondelete="CASCADE"), nullable=False)
    permission_id = db.Column(db.Integer, db.ForeignKey("permissions.permission_id", ondelete="CASCADE"), nullable=False)
    
    __table_args__ = (UniqueConstraint("page_id", "permission_id", name="page_permission_unique"),)
    
    