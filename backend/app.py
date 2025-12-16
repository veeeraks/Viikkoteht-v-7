from flask import Flask
import os
import mysql.connector

app = Flask(__name__)

def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

@app.route("/health")
def health():
    return "OK", 200

@app.route("/visits")
def visits():
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS visits (
            id INT AUTO_INCREMENT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute(
        "INSERT INTO visits (created_at) VALUES (NOW())"
    )
    db.commit()

    cursor.execute("SELECT COUNT(*) FROM visits")
    count = cursor.fetchone()[0]

    cursor.close()
    db.close()

    return f"Visit count: {count}", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
