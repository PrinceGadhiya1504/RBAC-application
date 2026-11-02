from config.database import db
from models.base import AuditBase

class Permission(AuditBase):
    __tablename__ = "permissions"

    permission_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False, unique=True)