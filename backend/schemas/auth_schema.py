import re
from datetime import date

def validate_register_data(data):
    errors = {}

    if not isinstance(data, dict):
        return {"body": "Request body must be a JSON object."}

    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")
    contact_number = data.get("contact_number")
    date_of_joining = data.get("date_of_joining")

    # Full name validation
    if not isinstance(full_name, str) or not full_name.strip():
        errors["full_name"] = "Full name is required."
    elif len(full_name.strip()) > 100:
        errors["full_name"] = "Full name must not exceed 100 characters."

    # Email validation
    if not isinstance(email, str) or not email.strip():
        errors["email"] = "Email is required."
    elif len(email.strip()) > 100:
        errors["email"] = "Email must not exceed 100 characters."
    elif not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email.strip()):
        errors["email"] = "Enter a valid email address."

    # Password validation
    if not isinstance(password, str) or not password:
        errors["password"] = "Password is required."
    elif len(password) < 8:
        errors["password"] = "Password must contain at least 8 characters."

    # Contact number is optional
    if contact_number is not None and contact_number != "":
        if not isinstance(contact_number, str):
            errors["contact_number"] = "Contact number must be a string."
        elif len(contact_number) > 20:
            errors["contact_number"] = "Contact number must not exceed 20 characters."

    # Date of joining is optional
    if date_of_joining is not None and date_of_joining != "":
        if not isinstance(date_of_joining, str):
            errors["date_of_joining"] = "Date must be a string in YYYY-MM-DD format."
        else:
            try:
                date.fromisoformat(date_of_joining)
            except ValueError:
                errors["date_of_joining"] = "Invalid date. Use YYYY-MM-DD format."

    return errors

def validate_login_data(data):
    errors = {}

    if not isinstance(data, dict):
        return {"body": "Request body must be a JSON object."}

    email = data.get("email")
    password = data.get("password")

    if not isinstance(email, str) or not email.strip():
        errors["email"] = "Email is required."
    elif len(email.strip()) > 100:
        errors["email"] = "Email must not exceed 100 characters."
    elif not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email.strip()):
        errors["email"] = "Enter a valid email address."

    if not isinstance(password, str) or not password:
        errors["password"] = "Password is required."
    elif len(password) < 8:
        errors["password"] = "Password must contain at least 8 characters."

    return errors