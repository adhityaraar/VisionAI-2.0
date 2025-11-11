from telegram import Bot
import matplotlib.pyplot as plt
from io import BytesIO
import subprocess, asyncio

BOT_TOKEN = "xxx"
CHAT_ID = ["xxx", "xxx"]
helmet = "helmet"

message = (
    "⚠️ Safety Gear Alert!\n"
    f"CamGuardians has detected a worker without a {helmet}. "
    "Please address this safety violation immediately."
)

def create_bar_chart():
    labels = [
        'Hardhat', 'Mask', 'NO-Hardhat', 'NO-Mask',
        'NO-Safety Vest', 'Person', 'Safety Cone',
        'Safety Vest', 'Machinery', 'Vehicle'
    ]
    values = [2, 1, 2, 0, 0, 0, 0, 0, 0, 0]

    # Sort by value desc
    sorted_data = sorted(zip(labels, values), key=lambda x: x[1], reverse=True)
    labels, values = zip(*sorted_data)

    fig, ax = plt.subplots()
    ax.bar(labels, values)  # let matplotlib handle colors

    ax.set_ylabel('Counts')
    ax.set_title('Safety Gear Detection')
    ax.grid(axis='y', linestyle='--', alpha=0.7, linewidth=0.7)
    plt.yticks([0, 1, 2, 3])
    plt.xticks(rotation=45, fontsize=8, ha='right')

    for i, v in enumerate(values):
        ax.text(i, v + 0.1, str(v), ha='center', va='bottom', fontweight='bold')

    plt.savefig('chart.png', bbox_inches='tight')
    plt.close(fig)

def get_ip_address():
    try:
        ip_address = subprocess.check_output(
            "ifconfig | grep \"inet \" | grep -Fv 127.0.0.1 | awk '{print $2}'",
            shell=True
        ).decode("utf-8").strip()
        return ip_address or "Could not get IP address"
    except subprocess.CalledProcessError:
        return "Could not get IP address"

bot = Bot(token=BOT_TOKEN)

async def send_telegram_alert(message: str, chat_ids):
    create_bar_chart()

    # Read once, reuse for all chats
    with open("chart.png", "rb") as f:
        photo_bytes = f.read()

    for chat_id in chat_ids:
        await bot.send_message(chat_id=chat_id, text=message)
        await bot.send_photo(chat_id=chat_id, photo=photo_bytes)

async def send_telegram_ip(chat_ids):
    ip = get_ip_address()
    ip_message = f"IP Address: http://{ip}:5000/"
    for chat_id in chat_ids:
        await bot.send_message(chat_id=chat_id, text=ip_message)

async def main():
    await send_telegram_ip(CHAT_ID)
    await send_telegram_alert(message, CHAT_ID)

if __name__ == "__main__":
    asyncio.run(main())
