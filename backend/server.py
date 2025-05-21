from waitress import serve
from app import app  # Ensure this matches your Flask app file

serve(app, host="0.0.0.0", port=8000)
