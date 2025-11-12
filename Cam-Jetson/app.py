from flask import Flask, render_template, Response
import cv2
import pandas as pd
from ultralytics import YOLO
from telegram import Bot
import asyncio
from datetime import datetime, timedelta
import threading

app = Flask(__name__)

HOME = "/home/adhityaraar/Documents"
model = YOLO(f"{HOME}/models/yolo5-v1.pt", 'cuda')

class_names = model.names

# Telegram configuration
BOT_TOKEN = "6474138130:AAF81sKjkWpt5Y5RA15kOiMDctDEB4tg_VY"
CHAT_ID = ["-4980773889"]
bot = Bot(token=BOT_TOKEN)

# Rate limiting - prevent spam alerts
last_alert_time = None
ALERT_COOLDOWN = timedelta(seconds=30)  # Minimum 30 seconds between alerts

async def send_telegram_alert(missing_count):
    """Send Telegram alert when missing safety gear is detected"""
    message = (
        f"⚠️ Safety Gear Alert!\n"
        f"CamGuardians has detected {missing_count} worker(s) without proper safety equipment. "
        "Please address this safety violation immediately."
    )
    
    for chat_id in CHAT_ID:
        try:
            await bot.send_message(chat_id=chat_id, text=message)
        except Exception as e:
            print(f"Error sending Telegram alert: {e}")

def send_alert_if_needed(missing_count):
    """Check rate limit and send alert if needed"""
    global last_alert_time
    print("masuk alert if needed")
    print("missing count: ", missing_count)
    
    if missing_count > 0:
        now = datetime.now()
        print("now: ", now)
        print("last alert time: ", last_alert_time)
        print("alert cooldown: ", ALERT_COOLDOWN)
        print("condition: ", last_alert_time is None or (now - last_alert_time) >= ALERT_COOLDOWN)
        if last_alert_time is None or (now - last_alert_time) >= ALERT_COOLDOWN:
            last_alert_time = now
            # Run async function in a background thread to avoid blocking video stream
            def run_async():
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                loop.run_until_complete(send_telegram_alert(missing_count))
                loop.close()
            
            thread = threading.Thread(target=run_async)
            thread.daemon = True
            thread.start()

def gen_frames():
    try:
        cap = cv2.VideoCapture(0)
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280) #1280
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720) #720
        cap.set(cv2.CAP_PROP_FPS, 10)
        print("masuk gen frames cam jetson")

        while True:
            ret, frame = cap.read()
            result = model(frame, agnostic_nms=True)[0]
            labels = []
            for box in result.boxes.data:
                x1, y1, x2, y2, confidence, class_id = box
                label = f"{class_names[int(class_id)]} {confidence:.2f}"
                labels.append(label)

                color = (0, 255, 0)  # Green
                if label.startswith("NO"):
                    color = (0, 0, 255)  # Red

                cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)
                cv2.putText(frame, label, (int(x1), int(y1)-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

            person_count = sum('Person' in label and float(label.split()[-1]) > 0.5 for label in labels)
            missing_safety = sum(label.startswith('NO') and float(label.split()[-1]) > 0.5 for label in labels)
            print("missing safety: ", missing_safety)

            # Send Telegram alert if missing safety gear detected
            if missing_safety > 0:
                send_alert_if_needed(missing_safety)

            cv2.putText(frame, f"Person: {person_count}", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            cv2.putText(frame, f"Missing PPE: {missing_safety}", (20, 80), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
            ret, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 70])
            frame = buffer.tobytes()
            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    except Exception as e:
        print(f"An error occurred: {e}")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000')

