def validate_page_permission_data(data):
    errors = {}

    page_id = data.get("page_id")
    permission_id = data.get("permission_id")

    if isinstance(page_id, bool) or not isinstance(page_id, int):
        errors["page_id"] = "Page ID must be an integer."
    elif page_id <= 0:
        errors["page_id"] = "Page ID must be greater than 0."

    if isinstance(permission_id, bool) or not isinstance(permission_id, int):
        errors["permission_id"] = "Permission ID must be an integer."
    elif permission_id <= 0:
        errors["permission_id"] = "Permission ID must be greater than 0."

    return errors
