from config.database import db

class Role(db.Model):
    __tablename__ = "roles"

    role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(500), nullable=True)
