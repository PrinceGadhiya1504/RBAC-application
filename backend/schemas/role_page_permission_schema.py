def validate_role_page_permission_data(data):
    if not isinstance(data, dict):
        return "Request body must be a valid JSON object."

    role_id = data.get("role_id")
    page_permission_id = data.get("page_permission_id")
    is_given = data.get("is_given")

    if isinstance(role_id, bool) or not isinstance(role_id, int):
        return "Role ID must be an integer."
    if role_id <= 0:
        return "Role ID must be greater than 0."

    if isinstance(page_permission_id, bool) or not isinstance(page_permission_id, int):
        return "Page permission ID must be an integer."
    if page_permission_id <= 0:
        return "Page permission ID must be greater than 0."

    if is_given is None or not isinstance(is_given, bool):
        return "is_given is required and must be a boolean."

    return None


def validate_bulk_role_page_permission_data(data):
    if not isinstance(data, dict):
        return "Request body must be a valid JSON object."

    role_id = data.get("role_id")
    permissions = data.get("permissions")

    if not role_id or isinstance(role_id, bool) or not isinstance(role_id, int) or role_id <= 0:
        return "role_id is required."

    if not isinstance(permissions, list):
        return "permissions must be a list."

    return None
