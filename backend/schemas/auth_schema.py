import re

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