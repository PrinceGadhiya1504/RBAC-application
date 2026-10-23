from config.database import db

class Position(db.Model):
    __tablename__ = "positions"
    
    position_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=True)
    description = db.Column(db.String(500), nullable=True)