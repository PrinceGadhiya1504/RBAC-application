def validate_page_data(data):
    errors = {}

    name = data.get("name")

    if not isinstance(name, str):
        errors["name"] = "Page name is required and must be a string."
    elif not name.strip():
        errors["name"] = "Page name cannot be empty."
    elif len(name.strip()) > 100:
        errors["name"] = "Page name cannot exceed 100 characters."

    return errors