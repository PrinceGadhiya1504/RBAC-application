def validate_position_data(data):
    if not isinstance(data, dict):
        return "Request body must be a valid JSON object."

    name = data.get("name")
    description = data.get("description")

    if not isinstance(name, str) or not name.strip():
        return "Position name is required."
    if len(name.strip()) > 100:
        return "Position name must not exceed 100 characters."

    if description is not None:
        if not isinstance(description, str):
            return "Description must be a string."
        if len(description) > 500:
            return "Description must not exceed 500 characters."

    return None
