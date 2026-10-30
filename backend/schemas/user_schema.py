from datetime import date

def validate_update_user_data(data):
    allowed_fields = {
        "full_name",
        "email",
        "contact_number",
        "date_of_joining",
        "role_id",
        "position_id",
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

    if "date_of_joining" in data:
        joining_date = data["date_of_joining"]
        if not isinstance(joining_date, str):
            return "Date must be a string in YYYY-MM-DD format."
        try:
            date.fromisoformat(joining_date)
        except ValueError:
            return "Invalid date. Use YYYY-MM-DD format."

    return None