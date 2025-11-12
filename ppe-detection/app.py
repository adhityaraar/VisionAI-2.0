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

# Person tracking for intelligent alerts
# Stores: {person_id: {'has_hardhat': bool, 'last_seen': timestamp}}
person_tracking = {}
PERSON_TIMEOUT = timedelta(seconds=30)  # Remove person state after 30 seconds

cap = None

async def send_telegram_alert(person_id):
    """Send Telegram alert when a person is detected without hardhat (high risk)"""
    message = (
        f"🚨 HIGH RISK ALERT - NO HARDHAT DETECTED!\n\n"
        f"Worker ID #{person_id} is not wearing a hardhat.\n"
        f"This is a critical safety violation that requires immediate attention.\n\n"
        f"⚠️ Please ensure all workers wear proper head protection in the construction zone."
    )
    
    for chat_id in CHAT_ID:
        try:
            await bot.send_message(chat_id=chat_id, text=message)
        except Exception as e:
            print(f"Error sending Telegram alert: {e}")

def cleanup_old_person_states():
    """Remove person states that haven't been seen for PERSON_TIMEOUT seconds"""
    global person_tracking
    current_time = datetime.now()
    to_remove = []
    
    for person_id, state in person_tracking.items():
        if (current_time - state['last_seen']) > PERSON_TIMEOUT:
            to_remove.append(person_id)
    
    for person_id in to_remove:
        del person_tracking[person_id]

def send_person_alert(person_id):
    """Send alert for a specific person without hardhat"""
    # Run async function in a background thread to avoid blocking video stream
    def run_async():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(send_telegram_alert(person_id))
        loop.close()
    
    thread = threading.Thread(target=run_async)
    thread.daemon = True
    thread.start()

def calculate_iou(box1, box2):
    """Calculate Intersection over Union between two bounding boxes"""
    x1_min, y1_min, x1_max, y1_max = box1
    x2_min, y2_min, x2_max, y2_max = box2
    
    # Calculate intersection area
    intersect_x_min = max(x1_min, x2_min)
    intersect_y_min = max(y1_min, y2_min)
    intersect_x_max = min(x1_max, x2_max)
    intersect_y_max = min(y1_max, y2_max)
    
    if intersect_x_max < intersect_x_min or intersect_y_max < intersect_y_min:
        return 0.0
    
    intersect_area = (intersect_x_max - intersect_x_min) * (intersect_y_max - intersect_y_min)
    
    # Calculate union area
    box1_area = (x1_max - x1_min) * (y1_max - y1_min)
    box2_area = (x2_max - x2_min) * (y2_max - y2_min)
    union_area = box1_area + box2_area - intersect_area
    
    return intersect_area / union_area if union_area > 0 else 0.0

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
    global person_tracking
    
    # Clean up old person states
    cleanup_old_person_states()
    
    # Use tracking mode to get persistent IDs for persons
    result = model.track(frame, agnostic_nms=True, persist=True)[0]
    
    # Separate detections by class
    persons = []  # [(x1, y1, x2, y2, confidence, track_id), ...]
    hardhats = []  # [(x1, y1, x2, y2, confidence), ...]
    no_hardhats = []  # [(x1, y1, x2, y2, confidence), ...]
    
    # Parse all detections
    if result.boxes.id is not None:
        for i, box in enumerate(result.boxes.data):
            # Unpack only the first 6 values (x1, y1, x2, y2, confidence, class_id)
            x1, y1, x2, y2, confidence, class_id = box[:6]
            class_name = class_names[int(class_id)]
            
            if class_name == "Person" and confidence > 0.5:
                track_id = int(result.boxes.id[i])
                persons.append((float(x1), float(y1), float(x2), float(y2), float(confidence), track_id))
            elif class_name == "Hardhat" and confidence > 0.5:
                hardhats.append((float(x1), float(y1), float(x2), float(y2), float(confidence)))
            elif class_name == "NO-Hardhat" and confidence > 0.5:
                no_hardhats.append((float(x1), float(y1), float(x2), float(y2), float(confidence)))
    
    # Track current frame's person states
    current_time = datetime.now()
    current_frame_persons = set()
    no_hardhat_count = 0
    
    # Process each tracked person
    for person_box in persons:
        px1, py1, px2, py2, p_conf, track_id = person_box
        current_frame_persons.add(track_id)
        
        # Determine if person has hardhat by checking IoU with hardhat/no-hardhat detections
        has_hardhat = False
        has_no_hardhat = False
        
        # Check for NO-Hardhat overlap (high priority)
        for nh_box in no_hardhats:
            iou = calculate_iou((px1, py1, px2, py2), nh_box[:4])
            if iou > 0.3:  # Threshold for considering hardhat belongs to person
                has_no_hardhat = True
                break
        
        # If no NO-Hardhat detected, check for Hardhat
        if not has_no_hardhat:
            for h_box in hardhats:
                iou = calculate_iou((px1, py1, px2, py2), h_box[:4])
                if iou > 0.3:
                    has_hardhat = True
                    break
        
        # Determine current state
        person_has_hardhat = has_hardhat and not has_no_hardhat
        
        # Check if we need to send an alert
        if track_id in person_tracking:
            # Person was tracked before
            previous_state = person_tracking[track_id]['has_hardhat']
            
            if not person_has_hardhat and previous_state:
                # Person removed hardhat - SEND ALERT
                print(f"ALERT: Person {track_id} removed hardhat!")
                send_person_alert(track_id)
            elif not person_has_hardhat and not previous_state:
                # Person still without hardhat - NO ALERT (already alerted)
                pass
        else:
            # New person detected
            if not person_has_hardhat:
                # New person without hardhat - SEND ALERT
                print(f"ALERT: Person {track_id} first detected without hardhat!")
                send_person_alert(track_id)
        
        # Update tracking state
        person_tracking[track_id] = {
            'has_hardhat': person_has_hardhat,
            'last_seen': current_time
        }
        
        # Count for display
        if not person_has_hardhat:
            no_hardhat_count += 1
        
        # Draw person bounding box
        color = (0, 255, 0) if person_has_hardhat else (0, 0, 255)
        cv2.rectangle(frame, (int(px1), int(py1)), (int(px2), int(py2)), color, 2)
        status = "Safe" if person_has_hardhat else "NO HARDHAT!"
        cv2.putText(frame, f"ID:{track_id} {status}", (int(px1), int(py1)-10), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
    
    # Draw all hardhat detections for reference
    for h_box in hardhats:
        hx1, hy1, hx2, hy2, h_conf = h_box
        cv2.rectangle(frame, (int(hx1), int(hy1)), (int(hx2), int(hy2)), (255, 255, 0), 1)
    
    for nh_box in no_hardhats:
        nhx1, nhy1, nhx2, nhy2, nh_conf = nh_box
        cv2.rectangle(frame, (int(nhx1), int(nhy1)), (int(nhx2), int(nhy2)), (0, 165, 255), 1)
    
    # Display statistics
    person_count = len(persons)
    label_stats = [("Workers", person_count), ("NO Hardhat", no_hardhat_count)]
    
    for i, (label_text, label_count) in enumerate(label_stats):
        color = (0, 0, 255) if label_text == "NO Hardhat" and label_count > 0 else (255, 255, 255)
        cv2.putText(frame, f"{label_text}: {label_count}", (20, 40 + i * 40), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

    _, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 70])
    return buffer.tobytes()

def gen_frames():
    print("masuk gen frames ppe detection")
    global cap
    prev_time = time.time()

    while True:
        cap = get_video_capture()
        if cap is None:
            time.sleep(1)
            continue

        ret, frame = cap.read()
        if not ret:
            continue

        frame_bytes = gen_label(frame)
        
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

