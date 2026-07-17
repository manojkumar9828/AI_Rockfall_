"""
Flask application factory and main entry point.

Wires up Blueprints, session config, and error handlers for the
AI-Based Rockfall Prediction and Alert System.
"""
import os
from datetime import datetime, timedelta
from functools import wraps

from flask import (
    Flask, render_template, request, redirect, url_for, session,
    flash, jsonify, send_file, g, abort
)
from werkzeug.utils import secure_filename

import database
from model.predict import predict_image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "static", "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

# Default settings stored in the session-backed config
DEFAULT_SETTINGS = {
    "threshold": 70.0,
    "sensitivity": "medium",
    "theme": "dark",
}


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "rockfall-ai-secret-key-2025"
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
    app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    # Initialize database on startup
    database.init_db()

    # ---- Helpers ----
    def allowed_file(filename):
        return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

    def login_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if "user_id" not in session:
                flash("Please log in to access this page.", "warning")
                return redirect(url_for("login"))
            return f(*args, **kwargs)
        return decorated

    def admin_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if "user_id" not in session:
                flash("Please log in to access this page.", "warning")
                return redirect(url_for("login"))
            if session.get("role") != "admin":
                abort(403)
            return f(*args, **kwargs)
        return decorated

    def get_settings():
        return dict(session.get("settings", DEFAULT_SETTINGS))

    def alert_for_prediction(class_name):
        if class_name == "Dangerous":
            return ("danger", "Immediate evacuation required.")
        elif class_name == "Warning":
            return ("warning", "Possible rockfall detected.")
        else:
            return ("safe", "No immediate risk detected.")

    @app.context_processor
    def inject_globals():
        return {
            "current_user": session.get("username"),
            "current_role": session.get("role"),
            "settings": get_settings(),
            "now": datetime.now(),
        }

    # ---- Routes ----

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/login", methods=["GET", "POST"])
    def login():
        if request.method == "POST":
            username = request.form.get("username", "").strip()
            password = request.form.get("password", "")
            user = database.verify_user(username, password)
            if user:
                session["user_id"] = user["id"]
                session["username"] = user["username"]
                session["role"] = user["role"]
                session["settings"] = dict(DEFAULT_SETTINGS)
                database.log_action(user["id"], "login", f"User {username} logged in")
                flash(f"Welcome back, {user['username']}!", "success")
                return redirect(url_for("dashboard"))
            flash("Invalid username or password.", "danger")
        return render_template("login.html")

    @app.route("/register", methods=["GET", "POST"])
    def register():
        if request.method == "POST":
            username = request.form.get("username", "").strip()
            email = request.form.get("email", "").strip()
            password = request.form.get("password", "")
            if not username or not email or not password:
                flash("All fields are required.", "danger")
                return render_template("login.html", tab="register")
            ok = database.create_user(username, email, password, role="user")
            if ok:
                database.log_action(None, "register", f"New user {username} registered")
                flash("Account created. Please log in.", "success")
                return redirect(url_for("login"))
            flash("Username or email already exists.", "danger")
        return render_template("login.html", tab="register")

    @app.route("/logout")
    def logout():
        database.log_action(session.get("user_id"), "logout", "User logged out")
        session.clear()
        flash("You have been logged out.", "info")
        return redirect(url_for("index"))

    @app.route("/dashboard")
    @login_required
    def dashboard():
        stats = database.get_dashboard_stats()
        trends = database.get_prediction_trends()
        labels = [r["created_date"] for r in trends]
        counts = [r["count"] for r in trends]
        return render_template("dashboard.html", stats=stats, labels=labels, counts=counts)

    @app.route("/upload", methods=["GET", "POST"])
    @login_required
    def upload():
        if request.method == "POST":
            if "file" not in request.files:
                flash("No file selected.", "danger")
                return redirect(url_for("upload"))
            file = request.files["file"]
            if file.filename == "":
                flash("No file selected.", "danger")
                return redirect(url_for("upload"))
            if not allowed_file(file.filename):
                flash("Invalid file type. Allowed: PNG, JPG, JPEG.", "danger")
                return redirect(url_for("upload"))
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_")
            filename = timestamp + filename
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(filepath)
            database.log_action(session["user_id"], "upload", f"Uploaded {filename}")
            return redirect(url_for("prediction", filename=filename))
        return render_template("upload.html")

    @app.route("/prediction")
    @login_required
    def prediction():
        filename = request.args.get("filename")
        if not filename:
            return redirect(url_for("upload"))
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        if not os.path.exists(filepath):
            flash("Image not found.", "danger")
            return redirect(url_for("upload"))
        try:
            result = predict_image(filepath)
        except FileNotFoundError as e:
            flash(str(e), "danger")
            return redirect(url_for("upload"))

        pred_id = database.save_prediction(
            session["user_id"], filename, f"uploads/{filename}",
            result["class_name"], result["confidence"],
            result["risk_level"], result["prediction_time"],
        )
        alert_type, alert_msg = alert_for_prediction(result["class_name"])
        database.create_alert(pred_id, alert_type, alert_msg)
        database.log_action(session["user_id"], "predict",
                            f"Predicted {filename}: {result['class_name']} ({result['confidence']}%)")
        result["alert_type"] = alert_type
        result["alert_message"] = alert_msg
        result["filename"] = filename
        result["pred_id"] = pred_id
        return render_template("prediction.html", result=result)

    @app.route("/history")
    @login_required
    def history():
        search = request.args.get("q", "")
        preds = database.get_predictions(search=search)
        return render_template("history.html", preds=preds, search=search)

    @app.route("/history/delete/<int:pred_id>", methods=["POST"])
    @login_required
    def delete_history(pred_id):
        database.delete_prediction(pred_id)
        database.log_action(session["user_id"], "delete", f"Deleted prediction {pred_id}")
        flash("Record deleted.", "info")
        return redirect(url_for("history"))

    @app.route("/history/export")
    @login_required
    def export_csv():
        import csv
        import io
        preds = database.get_predictions()
        si = io.StringIO()
        writer = csv.writer(si)
        writer.writerow(["ID", "Image Name", "Prediction", "Confidence (%)", "Risk Level", "Date", "Time"])
        for p in preds:
            writer.writerow([p["id"], p["image_name"], p["prediction"], p["confidence"],
                             p["risk_level"], p["created_date"], p["created_time"]])
        output = si.getvalue()
        si.close()
        from flask import Response
        return Response(
            output,
            mimetype="text/csv",
            headers={"Content-Disposition": "attachment; filename=rockfall_history.csv"},
        )

    @app.route("/reports", methods=["GET", "POST"])
    @login_required
    def reports():
        report_data = None
        if request.method == "POST":
            report_type = request.form.get("report_type", "daily")
            today = datetime.now().date()
            if report_type == "daily":
                start = today
                end = today
            elif report_type == "weekly":
                start = today - timedelta(days=6)
                end = today
            else:
                start = today.replace(day=1)
                end = today
            preds = database.get_predictions()
            filtered = [p for p in preds if start.strftime("%Y-%m-%d") <= p["created_date"] <= end.strftime("%Y-%m-%d")]
            total = len(filtered)
            safe = sum(1 for p in filtered if p["prediction"] == "Safe")
            warning = sum(1 for p in filtered if p["prediction"] == "Warning")
            danger = sum(1 for p in filtered if p["prediction"] == "Dangerous")
            accuracy = round((safe / total * 100) if total else 0, 2)
            report_data = {
                "type": report_type, "start": start.strftime("%Y-%m-%d"),
                "end": end.strftime("%Y-%m-%d"), "total": total,
                "safe": safe, "warning": warning, "danger": danger, "accuracy": accuracy,
            }
            database.save_report(session["user_id"], report_type,
                                  start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d"), report_data)
            database.log_action(session["user_id"], "report", f"Generated {report_type} report")
        saved_reports = database.get_reports()
        return render_template("reports.html", report=report_data, saved_reports=saved_reports)

    @app.route("/settings", methods=["GET", "POST"])
    @login_required
    def settings():
        if request.method == "POST":
            session["settings"] = {
                "threshold": float(request.form.get("threshold", 70)),
                "sensitivity": request.form.get("sensitivity", "medium"),
                "theme": request.form.get("theme", "dark"),
            }
            database.log_action(session["user_id"], "settings", "Updated settings")
            flash("Settings saved.", "success")
            return redirect(url_for("settings"))
        return render_template("settings.html")

    @app.route("/admin")
    @admin_required
    def admin():
        users = database.get_all_users()
        preds = database.get_predictions()
        logs = database.get_system_logs()
        reports = database.get_reports()
        return render_template("admin.html", users=users, preds=preds, logs=logs, reports=reports)

    @app.route("/admin/delete_user/<int:user_id>", methods=["POST"])
    @admin_required
    def delete_user(user_id):
        if user_id == session.get("user_id"):
            flash("Cannot delete your own account.", "danger")
            return redirect(url_for("admin"))
        database.delete_user(user_id)
        database.log_action(session["user_id"], "delete_user", f"Deleted user {user_id}")
        flash("User deleted.", "info")
        return redirect(url_for("admin"))

    @app.route("/admin/create_user", methods=["POST"])
    @admin_required
    def create_user_admin():
        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        role = request.form.get("role", "user")
        if not all([username, email, password]):
            flash("All fields required.", "danger")
            return redirect(url_for("admin"))
        ok = database.create_user(username, email, password, role)
        if ok:
            database.log_action(session["user_id"], "create_user", f"Created user {username}")
            flash("User created.", "success")
        else:
            flash("Username or email already exists.", "danger")
        return redirect(url_for("admin"))

    # Info pages
    @app.route("/mine-info")
    def mine_info():
        return render_template("mine_info.html")

    @app.route("/emergency")
    def emergency():
        return render_template("emergency.html")

    @app.route("/documentation")
    def documentation():
        return render_template("documentation.html")

    @app.route("/api/stats")
    @login_required
    def api_stats():
        stats = database.get_dashboard_stats()
        return jsonify(stats)

    # Error handlers
    @app.errorhandler(403)
    def forbidden(e):
        return render_template("error.html", code=403,
                               message="Access forbidden. Admin privileges required."), 403

    @app.errorhandler(404)
    def not_found(e):
        return render_template("error.html", code=404,
                               message="Page not found."), 404

    @app.errorhandler(500)
    def server_error(e):
        return render_template("error.html", code=500,
                               message="Internal server error."), 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
