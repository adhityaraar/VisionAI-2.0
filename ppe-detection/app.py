from flask import Flask, render_template, Response, jsonify
import cv2
from ultralytics import YOLO
import atexit
import time
import subprocess
import os
import logging
from telegram import Bot
import asyncio
from datetime import datetime, timedelta
import threading

app = Flask(__name__)

# Use current directory or models directory for model path
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "best.pt")
if not os.path.exists(MODEL_PATH):
    MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "yolov8n.pt")
if not os.path.exists(MODEL_PATH):
    MODEL_PATH = os.path.join(os.path.dirname(__file__), "yolov8n.pt")

# Try CUDA if available, otherwise use CPU
device = 'cuda' if os.environ.get('USE_CUDA', '').lower() == 'true' else 'cpu'
try:
    model = YOLO(MODEL_PATH, device=device)
except:
    model = YOLO(MODEL_PATH)  # Fallback without device specification
class_names = model.names

# Telegram configuration
BOT_TOKEN = "6474138130:AAF81sKjkWpt5Y5RA15kOiMDctDEB4tg_VY"
CHAT_ID = ["-4980773889"]
bot = Bot(token=BOT_TOKEN)

# Rate limiting - prevent spam alerts
last_alert_time = None
ALERT_COOLDOWN = timedelta(seconds=1)  # Minimum 30 seconds between alerts
high_risk_active = False

cap = None

async def send_telegram_alert(no_hardhat_count):
    """Send Telegram alert when high risk is detected"""
    message = (
        f"⚠️ Safety Gear Alert!\n"
        f"CamGuardians has detected {no_hardhat_count} worker(s) without a hardhat. "
        "Please address this safety violation immediately."
    )
    
    for chat_id in CHAT_ID:
        try:
            await bot.send_message(chat_id=chat_id, text=message)
        except Exception as e:
            print(f"Error sending Telegram alert: {e}")

def send_alert_if_needed(no_hardhat_count):
    """Check rate limit and send high risk alert if needed"""
    global last_alert_time
    
    if no_hardhat_count > 0:
        now = datetime.now()
        if last_alert_time is None or (now - last_alert_time) >= ALERT_COOLDOWN:
            last_alert_time = now
            # Run async function in a background thread to avoid blocking video stream
            def run_async():
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                loop.run_until_complete(send_telegram_alert(no_hardhat_count))
                loop.close()
            
            thread = threading.Thread(target=run_async)
            thread.daemon = True
            thread.start()

def is_camera_index_valid(index):
    print("masuk is camera index valid ppe detection")
    """Check if camera index is valid (cross-platform)"""
    # Try V4L2 on Linux, default backend on macOS/Windows
    try:
        import platform
        if platform.system() == 'Linux':
            cap = cv2.VideoCapture(index, cv2.CAP_V4L2)
        else:
            cap = cv2.VideoCapture(index)
    except:
        cap = cv2.VideoCapture(index)
    is_opened = cap.isOpened()
    cap.release()
    return is_opened

def get_video_capture():
    print("masuk get video capture ppe detection")
    global cap
    if cap is None or not cap.isOpened():
        if cap is not None:
            cap.release()
        cap = next((cv2.VideoCapture(i) for i in range(10) if is_camera_index_valid(i)), None)
        if cap is not None:
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, 800)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 600)
    return cap

def gen_label(frame):
    print("masuk gen label ppe detection")
    result = model(frame, agnostic_nms=True)[0]
    labels = []

    for box in result.boxes.data:
        x1, y1, x2, y2, confidence, class_id = box
        label = f"{class_names[int(class_id)]} {confidence:.2f}"
        labels.append(label)
        color = (0, 0, 255) if label.startswith("NO") else (0, 255, 0)
        cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)
        cv2.putText(frame, label, (int(x1), int(y1)-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

    person_count = sum('Person' in label and float(label.split()[-1]) > 0.5 for label in labels)
    no_hardhat_count = sum(label.startswith('NO-Hardhat') and float(label.split()[-1]) > 0.5 for label in labels)

    label_stats = [("Person", person_count), ("No Hardhat", no_hardhat_count)]
    
    for i, (label_text, label_count) in enumerate(label_stats):
        cv2.putText(frame, f"{label_text}: {label_count}", (20, 40 + i * 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    _, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 70])
    return buffer.tobytes(), no_hardhat_count

def gen_frames():
    print("masuk gen frames ppe detection")
    global cap, high_risk_active
    prev_time = time.time()

    while True:
        cap = get_video_capture()
        if cap is None:
            time.sleep(1)
            continue

        ret, frame = cap.read()
        if not ret:
            continue

        frame_bytes, no_hardhat_count = gen_label(frame)
        
        # Send Telegram alert only when a new high-risk (no hardhat) event starts
        if no_hardhat_count > 0:
            if not high_risk_active:
                high_risk_active = True
                send_alert_if_needed(no_hardhat_count)
        else:
            if high_risk_active:
                high_risk_active = False
        
        current_time = time.time()
        elapsed_time = current_time - prev_time
        fps = 1.0 / elapsed_time if elapsed_time > 0 else 0
        prev_time = current_time
        print(f"FPS: {fps:.2f}")

        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/shutdown', methods=['POST'])
def shutdown():
    """Optional shutdown endpoint - configure shutdown script path if needed"""
    shutdown_script = os.environ.get('SHUTDOWN_SCRIPT', '')
    if shutdown_script and os.path.exists(shutdown_script):
        try:
            subprocess.run(['bash', shutdown_script])
            return jsonify({"message": "Shutting down. Please wait..."})
        except Exception as e:
            logging.exception("Failed to shut down")
            return jsonify({"error": str(e)})
    else:
        return jsonify({"message": "Shutdown script not configured"})

def cleanup():
    global cap
    if cap is not None:
        cap.release()

if __name__ == '__main__':
    import warnings
    warnings.filterwarnings("ignore")
    atexit.register(cleanup)
    app.run(host='0.0.0.0', port=5000, debug=True)

