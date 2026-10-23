def validate_role_page_permission_data(data):
    errors = {}

    role_id = data.get("role_id")
    page_permission_id = data.get("page_permission_id")
    is_given = data.get("is_given", False)

    if isinstance(role_id, bool) or not isinstance(role_id, int):
        errors["role_id"] = "Role ID must be an integer."
    elif role_id <= 0:
        errors["role_id"] = "Role ID must be greater than 0."

    if (isinstance(page_permission_id, bool) or not isinstance(page_permission_id, int)):
        errors["page_permission_id"] = "Page permission ID must be an integer."
    elif page_permission_id <= 0:
        errors["page_permission_id"] = "Page permission ID must be greater than 0."

    if not isinstance(is_given, bool):
        errors["is_given"] = "is_given must be a boolean."

    return errors
