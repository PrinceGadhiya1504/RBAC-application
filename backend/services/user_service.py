from datetime import date
from flask_bcrypt import Bcrypt
from sqlalchemy import select
from config.database import db
from models.user import User
from models.role import Role
from models.user_role import UserRole
from models.position import Position
from models.user_position import UserPosition
from utils.file_upload import save_uploaded_image, delete_image

bcrypt = Bcrypt()

def get_all_users():
    users = db.session.execute(select(User).order_by(User.user_id)).scalars().all()

    user_roles = {
        ur.user_id: (role.role_id, role.name)
        for ur, role in db.session.query(UserRole, Role).join(Role, UserRole.role_id == Role.role_id).all()
    }

    all_positions = (
        db.session.query(UserPosition, Position)
        .join(Position, UserPosition.position_id == Position.position_id)
        .order_by(UserPosition.start_date.desc(), UserPosition.user_position_id.desc())
        .all()
    )

    user_positions = {}
    for up, pos in all_positions:
        is_current = up.end_date is None
        pos_data = {
            "position_id": pos.position_id,
            "position_name": pos.name,
            "start_date": up.start_date.isoformat() if up.start_date else None,
            "end_date": up.end_date.isoformat() if up.end_date else None,
            "is_current": is_current,
        }
        if up.user_id not in user_positions:
            user_positions[up.user_id] = pos_data
        elif is_current and not user_positions[up.user_id]["is_current"]:
            user_positions[up.user_id] = pos_data

    return [
        {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
            "contact_number": user.contact_number,
            "profile_picture": user.profile_picture,
            "date_of_joining": (
                user.date_of_joining.isoformat()
                if user.date_of_joining
                else None
            ),
            "end_date": (
                user_positions[user.user_id]["end_date"]
                if user.user_id in user_positions
                else None
            ),
            "role_id": user_roles[user.user_id][0] if user.user_id in user_roles else None,
            "role_name": user_roles[user.user_id][1] if user.user_id in user_roles else None,
            "position_id": (
                user_positions[user.user_id]["position_id"]
                if user.user_id in user_positions
                else None
            ),
            "position_name": (
                user_positions[user.user_id]["position_name"]
                if user.user_id in user_positions
                else None
            ),
        }
        for user in users
    ]

def get_user_by_id(user_id):
    user = db.session.get(User, user_id)

    if not user:
        return None

    ur_assignment = (
        db.session.query(UserRole, Role)
        .join(Role, UserRole.role_id == Role.role_id)
        .filter(UserRole.user_id == user_id)
        .first()
    )

    position_records = (
        db.session.query(UserPosition, Position)
        .join(Position, UserPosition.position_id == Position.position_id)
        .filter(UserPosition.user_id == user_id)
        .order_by(UserPosition.start_date.desc(), UserPosition.user_position_id.desc())
        .all()
    )

    position_history = [
        {
            "user_position_id": up.user_position_id,
            "position_id": pos.position_id,
            "position_name": pos.name,
            "start_date": up.start_date.isoformat() if up.start_date else None,
            "end_date": up.end_date.isoformat() if up.end_date else None,
            "is_current": up.end_date is None,
        }
        for up, pos in position_records
    ]

    current_position = next((item for item in position_history if item["is_current"]), None)
    if not current_position and position_history:
        current_position = position_history[0]

    return {
        "user_id": user.user_id,
        "full_name": user.full_name,
        "email": user.email,
        "contact_number": user.contact_number,
        "profile_picture": user.profile_picture,
        "date_of_joining": (
            user.date_of_joining.isoformat()
            if user.date_of_joining
            else None
        ),
        "end_date": current_position["end_date"] if current_position else None,
        "role_id": ur_assignment[1].role_id if ur_assignment else None,
        "role_name": ur_assignment[1].name if ur_assignment else None,
        "position_id": current_position["position_id"] if current_position else None,
        "position_name": current_position["position_name"] if current_position else None,
        "position_history": position_history,
    }

def create_user(data):
    email = data["email"].strip().lower()

    existing_user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if existing_user:
        return {
            "success": False,
            "message": "Email is already registered.",
        }, 409

    password_hash = bcrypt.generate_password_hash(
        data["password"]
    ).decode("utf-8")

    joining_date = (
        date.fromisoformat(data["date_of_joining"])
        if data.get("date_of_joining")
        else date.today()
    )
    end_date_val = (
        date.fromisoformat(data["end_date"])
        if data.get("end_date")
        else None
    )

    user = User(
        full_name=data["full_name"].strip(),
        email=email,
        contact_number=data.get("contact_number", "").strip() or None,
        date_of_joining=joining_date,
        password_hash=password_hash,
    )

    try:
        db.session.add(user)
        db.session.flush()

        role_id = data.get("role_id")
        role_name = None
        if role_id:
            role = db.session.get(Role, role_id)
            if not role:
                return {"success": False, "message": "Role not found."}, 404
            db.session.add(UserRole(user_id=user.user_id, role_id=role.role_id))
            role_name = role.name

        position_id = data.get("position_id")
        position_name = None
        if position_id:
            pos = db.session.get(Position, position_id)
            if not pos:
                return {"success": False, "message": "Position not found."}, 404
            db.session.add(UserPosition(
                user_id=user.user_id,
                position_id=pos.position_id,
                start_date=user.date_of_joining or date.today(),
                end_date=end_date_val,
            ))
            position_name = pos.name

        db.session.commit()

        return {
            "success": True,
            "message": "User created successfully.",
            "user": {
                "user_id": user.user_id,
                "full_name": user.full_name,
                "email": user.email,
                "contact_number": user.contact_number,
                "profile_picture": user.profile_picture,
                "date_of_joining": user.date_of_joining.isoformat(),
                "end_date": end_date_val.isoformat() if end_date_val else None,
                "role_id": role_id if role_name else None,
                "role_name": role_name,
                "position_id": position_id if position_name else None,
                "position_name": position_name,
            },
        }, 201

    except Exception:
        db.session.rollback()
        raise

def update_user(user_id, data):
    user = db.session.get(User, user_id)

    if user is None:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    if "full_name" in data and data["full_name"]:
        user.full_name = data["full_name"].strip()

    if "email" in data and data["email"]:
        new_email = data["email"].strip().lower()
        if new_email != user.email:
            existing_user = db.session.execute(
                select(User).where(User.email == new_email, User.user_id != user_id)
            ).scalar_one_or_none()
            if existing_user:
                return {
                    "success": False,
                    "message": "Email is already registered.",
                }, 409
            user.email = new_email

    if "contact_number" in data:
        user.contact_number = data["contact_number"].strip() if data["contact_number"] else None

    if "date_of_joining" in data and data["date_of_joining"]:
        user.date_of_joining = date.fromisoformat(data["date_of_joining"])

    if "end_date" in data and data["end_date"]:
        parsed_end = date.fromisoformat(data["end_date"])
        effective_join = user.date_of_joining
        if effective_join and parsed_end <= effective_join:
            return {"success": False, "message": "End date must be greater than start date."}, 400

    if "role_id" in data:
        role_id = data["role_id"]
        ur = UserRole.query.filter_by(user_id=user_id).first()
        if role_id:
            role = db.session.get(Role, role_id)
            if not role:
                return {"success": False, "message": "Role not found."}, 404
            if ur:
                ur.role_id = role_id
            else:
                db.session.add(UserRole(user_id=user_id, role_id=role_id))
        elif ur:
            db.session.delete(ur)

    latest_up = (
        UserPosition.query.filter_by(user_id=user_id)
        .order_by(UserPosition.user_position_id.desc())
        .first()
    )

    if "position_id" in data:
        new_position_id = data["position_id"]

        if new_position_id:
            pos = db.session.get(Position, new_position_id)
            if not pos:
                return {"success": False, "message": "Position not found."}, 404

            new_end_date = date.fromisoformat(data["end_date"]) if data.get("end_date") else None

            if latest_up:
                if latest_up.position_id != new_position_id:
                    if new_end_date and new_end_date <= date.today():
                        return {"success": False, "message": "End date must be greater than start date."}, 400

                    if not latest_up.end_date or latest_up.end_date >= date.today():
                        latest_up.end_date = date.today()

                    new_up = UserPosition(
                        user_id=user_id,
                        position_id=new_position_id,
                        start_date=date.today(),
                        end_date=new_end_date,
                    )
                    db.session.add(new_up)
                else:
                    if "end_date" in data:
                        if new_end_date and latest_up.start_date and new_end_date <= latest_up.start_date:
                            return {"success": False, "message": "End date must be greater than start date."}, 400
                        latest_up.end_date = new_end_date
            else:
                start_date_val = user.date_of_joining or date.today()
                if new_end_date and new_end_date <= start_date_val:
                    return {"success": False, "message": "End date must be greater than start date."}, 400

                new_up = UserPosition(
                    user_id=user_id,
                    position_id=new_position_id,
                    start_date=start_date_val,
                    end_date=new_end_date,
                )
                db.session.add(new_up)
        elif latest_up:
            if not latest_up.end_date:
                latest_up.end_date = date.today()

    elif "end_date" in data and latest_up:
        if data["end_date"]:
            parsed_end = date.fromisoformat(data["end_date"])
            if latest_up.start_date and parsed_end <= latest_up.start_date:
                return {"success": False, "message": "End date must be greater than start date."}, 400
            latest_up.end_date = parsed_end
        else:
            latest_up.end_date = None

    try:
        db.session.commit()

        updated_user = get_user_by_id(user_id)

        return {
            "success": True,
            "message": "User updated successfully.",
            "user": updated_user,
        }, 200

    except Exception:
        db.session.rollback()
        raise

def delete_user(user_id):
    user = db.session.get(User, user_id)

    if user is None:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    image_to_delete = user.profile_picture

    try:
        db.session.delete(user)
        db.session.commit()

        if image_to_delete:
            delete_image(image_to_delete)

        return {
            "success": True,
            "message": "User deleted successfully."
        }, 200

    except Exception:
        db.session.rollback()
        raise

def upload_user_profile_picture(user_id, uploaded_file):
    user = db.session.get(User, user_id)

    if user is None:
        return {
            "success": False,
            "message": "User not found."
        }, 404

    image_name = save_uploaded_image(uploaded_file)
    old_image_name = user.profile_picture

    user.profile_picture = image_name
    db.session.commit()

    if old_image_name:
        delete_image(old_image_name)

    return {
        "success": True,
        "message": "Profile picture updated successfully.",
        "profile_picture": image_name,
        "user": get_user_by_id(user_id),
    }, 200
