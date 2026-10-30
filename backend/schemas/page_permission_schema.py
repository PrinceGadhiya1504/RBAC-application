def validate_page_permission_data(data):
    if not isinstance(data, dict):
        return "Request body must be a valid JSON object."

    page_id = data.get("page_id")
    permission_id = data.get("permission_id")

    if isinstance(page_id, bool) or not isinstance(page_id, int):
        return "Page ID must be an integer."
    if page_id <= 0:
        return "Page ID must be greater than 0."

    if isinstance(permission_id, bool) or not isinstance(permission_id, int):
        return "Permission ID must be an integer."
    if permission_id <= 0:
        return "Permission ID must be greater than 0."

    return None
