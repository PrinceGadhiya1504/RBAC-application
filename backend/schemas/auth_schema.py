import re
from datetime import date

def validate_register_data(data):
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

    if date_of_joining is not None and date_of_joining != "":
        if not isinstance(date_of_joining, str):
            return "Date must be a string in YYYY-MM-DD format."
        try:
            date.fromisoformat(date_of_joining)
        except ValueError:
            return "Invalid date. Use YYYY-MM-DD format."

    role_id = data.get("role_id")
    if role_id is not None and role_id != "":
        if not isinstance(role_id, int) or isinstance(role_id, bool) or role_id <= 0:
            return "Role ID must be a positive integer."

    position_id = data.get("position_id")
    if position_id is not None and position_id != "":
        if not isinstance(position_id, int) or isinstance(position_id, bool) or position_id <= 0:
            return "Position ID must be a positive integer."

    return None

def validate_login_data(data):
    if not isinstance(data, dict):
        return "Request body must be a valid JSON object."

    email = data.get("email")
    password = data.get("password")

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

    return None