from datetime import date

def validate_update_user_data(data):
    errors = {}

    allowed_fields = {
        "full_name",
        "email",
        "contact_number",
        "date_of_joining"
    }

    if not data:
        errors["body"] = "At least one field is required."
        return errors

    unknown_fields = set(data.keys()) - allowed_fields

    if unknown_fields:
        errors["fields"] = (
            f"Unsupported fields: {', '.join(sorted(unknown_fields))}"
        )

    if "full_name" in data:
        name = data["full_name"]

        if not isinstance(name, str) or not name.strip():
            errors["full_name"] = "Full name must not be empty."
        elif len(name.strip()) > 100:
            errors["full_name"] = "Full name must not exceed 100 characters."

    if "email" in data:
        email = data["email"]

        if not isinstance(email, str) or not email.strip():
            errors["email"] = "Email must not be empty."
        elif len(email.strip()) > 100 or "@" not in email:
            errors["email"] = "Please provide a valid email."

    if "contact_number" in data:
        contact = data["contact_number"]

        if contact is not None and (
            not isinstance(contact, str) or len(contact) > 20
        ):
            errors["contact_number"] = (
                "Contact number must be a string of at most 20 characters or null."
            )

    if "date_of_joining" in data:
        joining_date = data["date_of_joining"]

        if not isinstance(joining_date, str):
            errors["date_of_joining"] = "Date must be a string in YYYY-MM-DD format."
        else:
            try:
                date.fromisoformat(joining_date)
            except ValueError:
                errors["date_of_joining"] = (
                    "Invalid date. Use YYYY-MM-DD format."
                )

    return errors
