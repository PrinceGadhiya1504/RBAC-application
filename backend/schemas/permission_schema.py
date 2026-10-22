def validate_permission_data(data):
    errors = {}

    name = data.get("name")

    if not isinstance(name, str):
        errors["name"] = "Permission name is required and must be a string."
    elif not name.strip():
        errors["name"] = "Permission name cannot be empty."
    elif len(name.strip()) > 100:
        errors["name"] = "Permission name cannot exceed 100 characters."

    return errors
