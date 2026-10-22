def validate_user_role_data(data):
    errors = {}

    user_id = data.get("user_id")
    role_id = data.get("role_id")

    if isinstance(user_id, bool) or not isinstance(user_id, int):
        errors["user_id"] = "User ID must be an integer."
    elif user_id <= 0:
        errors["user_id"] = "User ID must be greater than 0."

    if isinstance(role_id, bool) or not isinstance(role_id, int):
        errors["role_id"] = "Role ID must be an integer."
    elif role_id <= 0:
        errors["role_id"] = "Role ID must be greater than 0."

    return errors
