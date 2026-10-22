def validate_role_data(data):
    errors = {}

    name = data.get("name")
    description = data.get("description")

    if not isinstance(name, str) or not name.strip():
        errors["name"] = "Role name is required."
    elif len(name.strip()) > 100:
        errors["name"] = "Role name cannot exceed 100 characters."

    if description is not None:
        if not isinstance(description, str):
            errors["description"] = "Description must be a string."
        elif len(description) > 500:
            errors["description"] = "Description cannot exceed 500 characters."

    return errors


def validate_update_role_data(data):
    errors = {}

    name = data.get("name")
    description = data.get("description")

    if not data:
        errors["body"] = "At least one field is required."
        return errors

    if "name" in data:
        if not isinstance(name, str) or not name.strip():
            errors["name"] = "Role name cannot be empty."
        elif len(name.strip()) > 100:
            errors["name"] = "Role name cannot exceed 100 characters."

    if "description" in data:
        if description is not None:
            if not isinstance(description, str):
                errors["description"] = "Description must be a string."
            elif len(description) > 500:
                errors["description"] = "Description cannot exceed 500 characters."

    return errors


