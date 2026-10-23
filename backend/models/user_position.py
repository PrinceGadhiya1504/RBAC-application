from config.database import db

class UserPosition(db.Model):
    __tablename__ = "user_positions"

    user_position_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    position_id = db.Column(db.Integer, db.ForeignKey("positions.position_id", ondelete="CASCADE"), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)