from sqlalchemy import inspect, text
from config.database import db

def run_migration():
    print("Running migration: add_profile_picture_to_users...")
    try:
        inspector = inspect(db.engine)
        columns = [c["name"] for c in inspector.get_columns("users")]
        if "profile_picture" not in columns:
            with db.engine.connect() as connection:
                connection.execute(
                    text("ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255) DEFAULT NULL;")
                )
                connection.commit()
            print("Successfully applied migration: add_profile_picture_to_users")
        else:
            print("Column 'profile_picture' already exists in 'users'. Skipping.")
    except Exception as e:
        print(f"Error applying migration: {e}")
        raise

if __name__ == "__main__":
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from app import app
    with app.app_context():
        run_migration()