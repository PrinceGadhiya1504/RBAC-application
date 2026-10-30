from datetime import date

def validate_user_position_data(data):
    if not isinstance(data, dict):
        return "Request body must be a valid JSON object."

    user_id = data.get("user_id")
    position_id = data.get("position_id")
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    if isinstance(user_id, bool) or not isinstance(user_id, int) or user_id <= 0:
        return "User ID must be a positive integer."

    if isinstance(position_id, bool) or not isinstance(position_id, int) or position_id <= 0:
        return "Position ID must be a positive integer."

    parsed_start_date = None

    if not isinstance(start_date, str) or not start_date.strip():
        return "Start date is required in YYYY-MM-DD format."
    else:
        try:
            parsed_start_date = date.fromisoformat(start_date)
        except ValueError:
            return "Start date must be a valid YYYY-MM-DD date."

    parsed_end_date = None

    if end_date is not None and end_date != "":
        if not isinstance(end_date, str) or not end_date.strip():
            return "End date must be a valid YYYY-MM-DD date or null."
        else:
            try:
                parsed_end_date = date.fromisoformat(end_date)
            except ValueError:
                return "End date must be a valid YYYY-MM-DD date."

    if parsed_start_date is not None and parsed_end_date is not None and parsed_end_date < parsed_start_date:
        return "End date cannot be before start date."

    return None
