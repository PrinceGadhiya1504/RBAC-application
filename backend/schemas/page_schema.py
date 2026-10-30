def validate_page_data(data):
    if not isinstance(data, dict):
        return "Request body must be a valid JSON object."

    name = data.get("name")

    if not isinstance(name, str):
        return "Page name is required and must be a string."
    if not name.strip():
        return "Page name cannot be empty."
    if len(name.strip()) > 100:
        return "Page name cannot exceed 100 characters."

    return None