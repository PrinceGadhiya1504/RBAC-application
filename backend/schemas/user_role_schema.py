def validate_user_role_data(data):
    if not isinstance(data, dict):
        return "Request body must be a valid JSON object."

    user_id = data.get("user_id")
    role_id = data.get("role_id")

    if isinstance(user_id, bool) or not isinstance(user_id, int):
        return "User ID must be an integer."
    if user_id <= 0:
        return "User ID must be greater than 0."

    if isinstance(role_id, bool) or not isinstance(role_id, int):
        return "Role ID must be an integer."
    if role_id <= 0:
        return "Role ID must be greater than 0."

    return None
