"""
Database initialization and helper functions.

Creates SQLite tables for Users, Predictions, Alerts, Reports, and SystemLogs.
Provides seed data (default admin + demo user) on first run.
"""
import sqlite3
from datetime import datetime
from pathlib import Path
from werkzeug.security import generate_password_hash, check_password_hash

DB_PATH = Path(__file__).resolve().parent / "database.db"


def get_db():
    """Return a sqlite3 connection with Row factory."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create all tables and seed default users if not present."""
    conn = get_db()
    cur = conn.cursor()

    # Users table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            created_at TEXT NOT NULL
        )
        """
    )

    # Predictions table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            image_name TEXT NOT NULL,
            image_path TEXT NOT NULL,
            prediction TEXT NOT NULL,
            confidence REAL NOT NULL,
            risk_level TEXT NOT NULL,
            prediction_time REAL,
            created_date TEXT NOT NULL,
            created_time TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        """
    )

    # Alerts table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prediction_id INTEGER NOT NULL,
            alert_type TEXT NOT NULL,
            message TEXT NOT NULL,
            created_date TEXT NOT NULL,
            created_time TEXT NOT NULL,
            FOREIGN KEY (prediction_id) REFERENCES predictions(id)
        )
        """
    )

    # Reports table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            report_type TEXT NOT NULL,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            total_predictions INTEGER NOT NULL,
            safe_count INTEGER NOT NULL,
            warning_count INTEGER NOT NULL,
            danger_count INTEGER NOT NULL,
            accuracy REAL NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        """
    )

    # System logs table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS system_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            action TEXT NOT NULL,
            details TEXT,
            created_at TEXT NOT NULL
        )
        """
    )

    conn.commit()

    # Seed default users if none exist
    cur.execute("SELECT COUNT(*) FROM users")
    count = cur.fetchone()[0]
    if count == 0:
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cur.execute(
            "INSERT INTO users (username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)",
            ("admin", "admin@rockfall.ai", generate_password_hash("admin123"), "admin", now),
        )
        cur.execute(
            "INSERT INTO users (username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)",
            ("user", "user@rockfall.ai", generate_password_hash("user123"), "user", now),
        )
        conn.commit()
        print("[DB] Seeded default users: admin/admin123, user/user123")

    conn.close()


def log_action(user_id, action, details=""):
    """Insert a system log entry."""
    conn = get_db()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conn.execute(
        "INSERT INTO system_logs (user_id, action, details, created_at) VALUES (?, ?, ?, ?)",
        (user_id, action, details, now),
    )
    conn.commit()
    conn.close()


def create_user(username, email, password, role="user"):
    """Insert a new user. Returns True on success, False if username/email taken."""
    conn = get_db()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        conn.execute(
            "INSERT INTO users (username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)",
            (username, email, generate_password_hash(password), role, now),
        )
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()


def verify_user(username, password):
    """Return user row if credentials valid, else None."""
    conn = get_db()
    row = conn.execute(
        "SELECT * FROM users WHERE username = ?", (username,)
    ).fetchone()
    conn.close()
    if row and check_password_hash(row["password_hash"], password):
        return row
    return None


def get_user_by_id(user_id):
    """Return user row by id."""
    conn = get_db()
    row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    return row


def get_all_users():
    """Return all users (without password hashes)."""
    conn = get_db()
    rows = conn.execute(
        "SELECT id, username, email, role, created_at FROM users ORDER BY id"
    ).fetchall()
    conn.close()
    return rows


def delete_user(user_id):
    """Delete a user by id."""
    conn = get_db()
    conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()


def save_prediction(user_id, image_name, image_path, prediction, confidence,
                    risk_level, prediction_time):
    """Insert a prediction record and return its id."""
    conn = get_db()
    now = datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%H:%M:%S")
    cur = conn.execute(
        """INSERT INTO predictions
           (user_id, image_name, image_path, prediction, confidence, risk_level,
            prediction_time, created_date, created_time)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (user_id, image_name, image_path, prediction, confidence, risk_level,
         prediction_time, date_str, time_str),
    )
    pred_id = cur.lastrowid
    conn.commit()
    conn.close()
    return pred_id


def create_alert(prediction_id, alert_type, message):
    """Insert an alert record linked to a prediction."""
    conn = get_db()
    now = datetime.now()
    conn.execute(
        "INSERT INTO alerts (prediction_id, alert_type, message, created_date, created_time) VALUES (?, ?, ?, ?, ?)",
        (prediction_id, alert_type, message, now.strftime("%Y-%m-%d"), now.strftime("%H:%M:%S")),
    )
    conn.commit()
    conn.close()


def get_predictions(user_id=None, search=""):
    """Return predictions, optionally filtered by user and/or search term."""
    conn = get_db()
    query = "SELECT * FROM predictions"
    params = []
    clauses = []
    if user_id is not None:
        clauses.append("user_id = ?")
        params.append(user_id)
    if search:
        clauses.append("(image_name LIKE ? OR prediction LIKE ? OR risk_level LIKE ?)")
        like = f"%{search}%"
        params.extend([like, like, like])
    if clauses:
        query += " WHERE " + " AND ".join(clauses)
    query += " ORDER BY id DESC"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return rows


def get_prediction_by_id(pred_id):
    conn = get_db()
    row = conn.execute("SELECT * FROM predictions WHERE id = ?", (pred_id,)).fetchone()
    conn.close()
    return row


def delete_prediction(pred_id):
    conn = get_db()
    conn.execute("DELETE FROM alerts WHERE prediction_id = ?", (pred_id,))
    conn.execute("DELETE FROM predictions WHERE id = ?", (pred_id,))
    conn.commit()
    conn.close()


def get_dashboard_stats(user_id=None):
    """Return aggregate counts for the dashboard."""
    conn = get_db()
    base = "SELECT COUNT(*) FROM predictions"
    params = []
    if user_id is not None:
        base += " WHERE user_id = ?"
        params.append(user_id)

    total = conn.execute(base, params).fetchone()[0]
    safe = conn.execute(base + " AND prediction = 'Safe'" if user_id else
                        "SELECT COUNT(*) FROM predictions WHERE prediction = 'Safe'",
                        params if user_id else []).fetchone()[0]
    warning = conn.execute(
        base + " AND prediction = 'Warning'" if user_id else
        "SELECT COUNT(*) FROM predictions WHERE prediction = 'Warning'",
        params if user_id else []).fetchone()[0]
    danger = conn.execute(
        base + " AND prediction = 'Dangerous'" if user_id else
        "SELECT COUNT(*) FROM predictions WHERE prediction = 'Dangerous'",
        params if user_id else []).fetchone()[0]
    alerts = conn.execute(
        "SELECT COUNT(*) FROM alerts a JOIN predictions p ON a.prediction_id = p.id"
        + (" WHERE p.user_id = ?" if user_id else ""),
        params if user_id else []).fetchone()[0]
    conn.close()
    return {
        "total": total,
        "safe": safe,
        "warning": warning,
        "danger": danger,
        "alerts": alerts,
    }


def get_prediction_trends(user_id=None):
    """Return daily prediction counts for the last 7 days."""
    conn = get_db()
    query = """
        SELECT created_date, COUNT(*) as count
        FROM predictions
    """
    params = []
    if user_id is not None:
        query += " WHERE user_id = ?"
        params.append(user_id)
    query += " GROUP BY created_date ORDER BY created_date DESC LIMIT 7"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    rows = list(reversed(rows))
    return rows


def get_system_logs(limit=100):
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM system_logs ORDER BY id DESC LIMIT ?", (limit,)
    ).fetchall()
    conn.close()
    return rows


def save_report(user_id, report_type, start_date, end_date, stats):
    conn = get_db()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conn.execute(
        """INSERT INTO reports
           (user_id, report_type, start_date, end_date, total_predictions,
            safe_count, warning_count, danger_count, accuracy, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (user_id, report_type, start_date, end_date, stats["total"],
         stats["safe"], stats["warning"], stats["danger"], stats["accuracy"], now),
    )
    conn.commit()
    conn.close()


def get_reports(user_id=None):
    conn = get_db()
    query = "SELECT * FROM reports"
    params = []
    if user_id is not None:
        query += " WHERE user_id = ?"
        params.append(user_id)
    query += " ORDER BY id DESC"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return rows
