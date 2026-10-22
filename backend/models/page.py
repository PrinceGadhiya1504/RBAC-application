from config.database import db

class Page(db.Model):
    __tablename__ = "pages"

    page_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False, unique=True)