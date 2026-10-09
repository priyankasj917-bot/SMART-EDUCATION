from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import datetime
import os

app = Flask(__name__)
CORS(app)

DB_FILE = 'fee_queue.db'
MAX_CAPACITY = 50
AVG_WAIT_TIME = 3 # minutes

@app.route('/')
@app.route('/CampusFlow_3D.html')
def campus_dashboard():
    return send_from_directory(app.root_path, 'CampusFlow_3D.html')

@app.route('/campus_bg.png')
def campus_background():
    return send_from_directory(app.root_path, 'campus_bg.png')

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS fee_queue (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                token_number TEXT,
                student_name TEXT,
                student_id TEXT,
                department TEXT,
                year TEXT,
                service_type TEXT,
                preferred_service TEXT,
                request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'WAITING'
            )
        ''')
        conn.commit()

@app.route('/api/fees/availability', methods=['GET'])
def availability():
    with get_db() as conn:
        waiting = conn.execute("SELECT COUNT(*) FROM fee_queue WHERE status = 'WAITING'").fetchone()[0]
        serving = conn.execute("SELECT COUNT(*) FROM fee_queue WHERE status = 'SERVING'").fetchone()[0]
        current_queue = waiting + serving
        
        serving_token = conn.execute("SELECT token_number FROM fee_queue WHERE status = 'SERVING' ORDER BY request_time LIMIT 1").fetchone()
        serving_token_id = serving_token[0] if serving_token else None

        next_avail = None
        if current_queue >= MAX_CAPACITY:
            next_avail = (datetime.datetime.now() + datetime.timedelta(minutes=AVG_WAIT_TIME)).strftime("%I:%M %p")

        return jsonify({
            "max_capacity": MAX_CAPACITY,
            "current_queue": current_queue,
            "available": MAX_CAPACITY - current_queue,
            "serving": serving_token_id,
            "next_availability_time": next_avail,
            "people_waiting": waiting
        })

@app.route('/api/fees/apply', methods=['POST'])
def apply():
    data = request.json
    with get_db() as conn:
        waiting = conn.execute("SELECT COUNT(*) FROM fee_queue WHERE status = 'WAITING'").fetchone()[0]
        serving = conn.execute("SELECT COUNT(*) FROM fee_queue WHERE status = 'SERVING'").fetchone()[0]
        current_queue = waiting + serving
        
        if current_queue >= MAX_CAPACITY:
            return jsonify({"error": "QUEUE FULL", "message": "All tokens are currently occupied."}), 400
            
        last_token = conn.execute("SELECT token_number FROM fee_queue ORDER BY id DESC LIMIT 1").fetchone()
        if last_token and '-' in last_token[0]:
            try:
                last_num = int(last_token[0].split('-')[1])
                new_num = last_num + 1
            except:
                new_num = 1
        else:
            new_num = 1
        token_str = f"FQ-{new_num:03d}"
        
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO fee_queue (token_number, student_name, student_id, department, year, service_type, preferred_service)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (token_str, data.get('student_name'), data.get('student_id'), data.get('department'), data.get('year'), data.get('service_type'), data.get('preferred_service')))
        conn.commit()
        
        queue_position = waiting + 1
        est_wait = queue_position * AVG_WAIT_TIME
        
        return jsonify({
            "token_number": token_str,
            "student_name": data.get('student_name'),
            "service_type": data.get('service_type'),
            "queue_position": queue_position,
            "estimated_wait": est_wait,
            "status": "WAITING"
        })

@app.route('/api/fees/queue', methods=['GET'])
def queue():
    with get_db() as conn:
        serving = conn.execute("SELECT * FROM fee_queue WHERE status = 'SERVING' ORDER BY request_time LIMIT 1").fetchone()
        waiting = conn.execute("SELECT * FROM fee_queue WHERE status = 'WAITING' ORDER BY request_time").fetchall()
        
        return jsonify({
            "serving": dict(serving) if serving else None,
            "waiting": [dict(w) for w in waiting]
        })

@app.route('/api/fees/status/<token>', methods=['GET'])
def status(token):
    with get_db() as conn:
        t = conn.execute("SELECT * FROM fee_queue WHERE token_number = ?", (token,)).fetchone()
        if not t:
            return jsonify({"error": "Not found"}), 404
        
        t_dict = dict(t)
        if t_dict['status'] == 'WAITING':
            waiting_before = conn.execute("SELECT COUNT(*) FROM fee_queue WHERE status = 'WAITING' AND request_time <= ?", (t_dict['request_time'],)).fetchone()[0]
            t_dict['queue_position'] = waiting_before
            t_dict['estimated_wait'] = waiting_before * AVG_WAIT_TIME
        else:
            t_dict['queue_position'] = 0
            t_dict['estimated_wait'] = 0
            
        return jsonify(t_dict)

@app.route('/api/fees/next', methods=['POST'])
def next_token():
    with get_db() as conn:
        conn.execute("UPDATE fee_queue SET status = 'COMPLETED' WHERE status = 'SERVING'")
        next_t = conn.execute("SELECT id FROM fee_queue WHERE status = 'WAITING' ORDER BY request_time LIMIT 1").fetchone()
        if next_t:
            conn.execute("UPDATE fee_queue SET status = 'SERVING' WHERE id = ?", (next_t[0],))
        conn.commit()
        return jsonify({"success": True})

@app.route('/api/fees/complete', methods=['POST'])
def complete_token():
    with get_db() as conn:
        conn.execute("UPDATE fee_queue SET status = 'COMPLETED' WHERE status = 'SERVING'")
        conn.commit()
        return jsonify({"success": True})

@app.route('/api/fees/cancel', methods=['POST'])
def cancel_token():
    data = request.json
    token = data.get('token_number')
    with get_db() as conn:
        conn.execute("UPDATE fee_queue SET status = 'CANCELLED' WHERE token_number = ?", (token,))
        conn.commit()
        return jsonify({"success": True})

if __name__ == '__main__':
    init_db()
    app.run(port=5000, debug=False)
