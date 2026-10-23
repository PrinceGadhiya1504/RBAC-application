from sqlalchemy.exc import IntegrityError
from config.database import db
from models.position import Position

def create_position(data):
    name = data.get("name")
    description = data.get("description")

    if name is not None and name.strip():
        existing_position = Position.query.filter(db.func.lower(Position.name) == name.strip().lower()).first()

        if existing_position:
            return {
                "success": False,
                "message": "Position name already exists."
            }, 409

    try:
        position = Position(
            name = name.strip(),
            description = description
        )

        db.session.add(position)
        db.session.commit()

        return {
            "success": True,
            "message": "Position created successfully.",
            "position": {
                "position_id": position.position_id,
                "name": position.name,
                "description": position.description
            }
        }, 201

    except IntegrityError:
        db.session.rollback()
        return {
            "success": False,
            "message": "Unable to create position due to a database constraint."
        }, 400

    except Exception:
        db.session.rollback()
        raise


def get_all_positions():
    positions = Position.query.order_by(Position.position_id).all()

    return {
        "success": True,
        "positions": [
            {
                "position_id": position.position_id,
                "name": position.name,
                "description": position.description
            }
            for position in positions
        ]
    }, 200


def get_position_by_id(position_id):
    position = db.session.get(Position, position_id)

    if not position:
        return {
            "success": False,
            "message": "Position not found."
        }, 404

    return {
        "success": True,
        "position": {
            "position_id": position.position_id,
            "name": position.name,
            "description": position.description
        }
    }, 200


def update_position(position_id, data):
    position = db.session.get(Position, position_id)

    if not position:
        return {
            "success": False,
            "message": "Position not found."
        }, 404

    name = data.get("name", position.name)
    description = data.get("description", position.description)

    if name is not None and name.strip():
        existing_position = Position.query.filter(
            db.func.lower(Position.name) == name.strip().lower(),
            Position.position_id != position_id
        ).first()

        if existing_position:
            return {
                "success": False,
                "message": "Position name already exists."
            }, 409

    try:
        position.name = name.strip()
        position.description = description

        db.session.commit()

        return {
            "success": True,
            "message": "Position updated successfully.",
            "position": {
                "position_id": position.position_id,
                "name": position.name,
                "description": position.description
            }
        }, 200

    except IntegrityError:
        db.session.rollback()
        return {
            "success": False,
            "message": "Unable to update position due to a database constraint."
        }, 400

    except Exception:
        db.session.rollback()
        raise


def delete_position(position_id):
    position = db.session.get(Position, position_id)

    if not position:
        return {
            "success": False,
            "message": "Position not found."
        }, 404

    try:
        db.session.delete(position)
        db.session.commit()

        return {
            "success": True,
            "message": "Position deleted successfully."
        }, 200

    except IntegrityError:
        db.session.rollback()
        return {
            "success": False,
            "message": "Cannot delete position because related records exist."
        }, 409

    except Exception:
        db.session.rollback()
        raise
