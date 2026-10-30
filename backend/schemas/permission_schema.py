def validate_permission_data(data):
    if not isinstance(data, dict):
        return "Request body must be a valid JSON object."

    name = data.get("name")

    if not isinstance(name, str):
        return "Permission name is required and must be a string."
    if not name.strip():
        return "Permission name cannot be empty."
    if len(name.strip()) > 100:
        return "Permission name cannot exceed 100 characters."

    return None
