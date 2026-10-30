def validate_role_data(data):
    if not isinstance(data, dict):
        return "Request body must be a valid JSON object."

    name = data.get("name")
    description = data.get("description")

    if not isinstance(name, str) or not name.strip():
        return "Role name is required."
    if len(name.strip()) > 100:
        return "Role name cannot exceed 100 characters."

    if description is not None:
        if not isinstance(description, str):
            return "Description must be a string."
        if len(description) > 500:
            return "Description cannot exceed 500 characters."

    return None


def validate_update_role_data(data):
    if not isinstance(data, dict):
        return "Request body must be a valid JSON object."

    if not data:
        return "At least one field is required."

    name = data.get("name")
    description = data.get("description")

    if "name" in data:
        if not isinstance(name, str) or not name.strip():
            return "Role name cannot be empty."
        if len(name.strip()) > 100:
            return "Role name cannot exceed 100 characters."

    if "description" in data:
        if description is not None:
            if not isinstance(description, str):
                return "Description must be a string."
            if len(description) > 500:
                return "Description cannot exceed 500 characters."

    return None
