import re
from datetime import date

def validate_create_user_data(data):
    if not isinstance(data, dict):
        return "Request body must be a valid JSON object."

    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")
    contact_number = data.get("contact_number")
    date_of_joining = data.get("date_of_joining")

    if not isinstance(full_name, str) or not full_name.strip():
        return "Full name is required."
    if len(full_name.strip()) > 100:
        return "Full name must not exceed 100 characters."

    if not isinstance(email, str) or not email.strip():
        return "Email is required."
    if len(email.strip()) > 100:
        return "Email must not exceed 100 characters."
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email.strip()):
        return "Enter a valid email address."

    if not isinstance(password, str) or not password:
        return "Password is required."
    if len(password) < 8:
        return "Password must contain at least 8 characters."

    if contact_number is not None and contact_number != "":
        if not isinstance(contact_number, str):
            return "Contact number must be a string."
        if len(contact_number) > 20:
            return "Contact number must not exceed 20 characters."

    parsed_start_date = date.today()
    if date_of_joining is not None and date_of_joining != "":
        if not isinstance(date_of_joining, str):
            return "Date must be a string in YYYY-MM-DD format."
        try:
            parsed_start_date = date.fromisoformat(date_of_joining)
        except ValueError:
            return "Invalid date. Use YYYY-MM-DD format."

    end_date = data.get("end_date")
    if end_date is not None and end_date != "":
        if not isinstance(end_date, str) or not end_date.strip():
            return "End date must be a valid YYYY-MM-DD date."
        try:
            parsed_end_date = date.fromisoformat(end_date.strip())
        except ValueError:
            return "Invalid end date. Use YYYY-MM-DD format."

        if parsed_end_date <= parsed_start_date:
            return "End date must be greater than start date."

    role_id = data.get("role_id")
    if role_id is not None and role_id != "":
        if not isinstance(role_id, int) or isinstance(role_id, bool) or role_id <= 0:
            return "Role ID must be a positive integer."

    position_id = data.get("position_id")
    if position_id is not None and position_id != "":
        if not isinstance(position_id, int) or isinstance(position_id, bool) or position_id <= 0:
            return "Position ID must be a positive integer."

    return None


def validate_update_user_data(data):
    allowed_fields = {
        "full_name",
        "email",
        "contact_number",
        "date_of_joining",
        "role_id",
        "position_id",
        "end_date",
    }

    if not isinstance(data, dict):
        return "Request body must be a valid JSON object."

    if not data:
        return "At least one field is required."

    unknown_fields = set(data.keys()) - allowed_fields
    if unknown_fields:
        return f"Unsupported fields: {', '.join(sorted(unknown_fields))}"

    if "role_id" in data and data["role_id"] is not None:
        if not isinstance(data["role_id"], int) or isinstance(data["role_id"], bool) or data["role_id"] <= 0:
            return "Role ID must be a positive integer or null."

    if "position_id" in data and data["position_id"] is not None:
        if not isinstance(data["position_id"], int) or isinstance(data["position_id"], bool) or data["position_id"] <= 0:
            return "Position ID must be a positive integer or null."

    if "full_name" in data:
        name = data["full_name"]
        if not isinstance(name, str) or not name.strip():
            return "Full name must not be empty."
        if len(name.strip()) > 100:
            return "Full name must not exceed 100 characters."

    if "email" in data:
        email = data["email"]
        if not isinstance(email, str) or not email.strip():
            return "Email must not be empty."
        if len(email.strip()) > 100 or "@" not in email:
            return "Please provide a valid email."

    if "contact_number" in data:
        contact = data["contact_number"]
        if contact is not None and (not isinstance(contact, str) or len(contact) > 20):
            return "Contact number must be a string of at most 20 characters or null."

    parsed_join_date = None
    if "date_of_joining" in data and data["date_of_joining"]:
        joining_date = data["date_of_joining"]
        if not isinstance(joining_date, str):
            return "Date must be a string in YYYY-MM-DD format."
        try:
            parsed_join_date = date.fromisoformat(joining_date)
        except ValueError:
            return "Invalid date. Use YYYY-MM-DD format."

    if "end_date" in data and data["end_date"] is not None and data["end_date"] != "":
        end_date = data["end_date"]
        if not isinstance(end_date, str):
            return "End date must be a string in YYYY-MM-DD format."
        try:
            parsed_end_date = date.fromisoformat(end_date)
        except ValueError:
            return "Invalid end date. Use YYYY-MM-DD format."

        if parsed_join_date is not None and parsed_end_date <= parsed_join_date:
            return "End date must be greater than start date."

    return None