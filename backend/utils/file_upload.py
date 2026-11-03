import os
import uuid
from werkzeug.utils import secure_filename
from config.settings import Config


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in Config.ALLOWED_EXTENSIONS
    )


def save_uploaded_image(uploaded_file):
    if not uploaded_file or not uploaded_file.filename:
        raise ValueError("Please select an image file to upload")

    original_name = secure_filename(uploaded_file.filename)
    if not original_name or not allowed_file(original_name):
        raise ValueError("Only JPG, JPEG, PNG and WEBP images are allowed")

    # Check the actual uploaded size
    uploaded_file.seek(0, os.SEEK_END)
    file_size = uploaded_file.tell()
    uploaded_file.seek(0)

    if file_size > Config.MAX_FILE_SIZE:
        raise ValueError("Image size must be 5 MB or less")

    extension = original_name.rsplit(".", 1)[1].lower()
    stored_name = f"{uuid.uuid4().hex}.{extension}"

    uploaded_file.save(os.path.join(Config.UPLOAD_FOLDER, stored_name))

    return stored_name


def delete_image(image_name):
    if not image_name:
        return

    image_path = os.path.join(Config.UPLOAD_FOLDER, os.path.basename(image_name))

    if os.path.isfile(image_path):
        os.remove(image_path)