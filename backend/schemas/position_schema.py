def validate_position_data(data):
    errors = {}

    name = data.get("name")
    description = data.get("description")

    if name is not None:
        if not isinstance(name, str):
            errors["name"] = "Name must be a string."
        elif len(name.strip()) > 100:
            errors["name"] = "Name must not exceed 100 characters."

    if description is not None:
        if not isinstance(description, str):
            errors["description"] = "Description must be a string."
        elif len(description) > 500:
            errors["description"] = "Description must not exceed 500 characters."

    return errors
