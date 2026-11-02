from sqlalchemy import func, event
from sqlalchemy.orm import Session
from flask_jwt_extended import get_jwt_identity
from config.database import db

class AuditBase(db.Model):
    __abstract__ = True

    created_by = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_by = db.Column(db.Integer, nullable=True)
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

@event.listens_for(Session, "before_flush")
def auto_populate_audit_fields(session, flush_context, instances):
    """
    Automatically populates created_by and updated_by using the authenticated JWT user_id.
    Runs seamlessly across all models inheriting AuditBase.
    """
    try:
        identity = get_jwt_identity()
        user_id = int(identity) if identity is not None else None
    except Exception:
        user_id = None

    if not user_id:
        return

    for obj in session.new:
        if isinstance(obj, AuditBase):
            if obj.created_by is None:
                obj.created_by = user_id
            if obj.updated_by is None:
                obj.updated_by = user_id

    for obj in session.dirty:
        if isinstance(obj, AuditBase):
            obj.updated_by = user_id