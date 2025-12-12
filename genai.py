# chat_watsonx_stream.py
import os
import sys
import json
import requests

# --- CONFIG ---
DEPLOYMENT_URL = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/57f63344-6c5d-4a83-ae7f-7c3edfb40e16/ai_service_stream?version=2021-05-01"
IAM_URL        = "https://iam.cloud.ibm.com/identity/token"
API_KEY        = "cpd-apikey-CSRs8CfrHw-8ed77a2a-013e-4f47-8bf7-f12b48b014ee-2025-11-12T11:09:56Z" #os.getenv("WATSONX_API_KEY")  # set this in your shell: export WATSONX_API_KEY=xxx

SYSTEM_PROMPT  = "You are a helpful assistant named watsonx.ai agent. Keep answers concise."

if not API_KEY:
    print("Missing env var WATSONX_API_KEY. Do: export WATSONX_API_KEY=YOUR_KEY")
    sys.exit(1)

def get_iam_token(api_key: str) -> str:
    resp = requests.post(
        IAM_URL,
        data={"apikey": api_key, "grant_type": "urn:ibm:params:oauth:grant-type:apikey"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["access_token"]

def stream_chat(messages, bearer_token: str):
    """
    Sends messages to watsonx.ai deployment using the streaming endpoint
    and yields incremental text chunks (decoded from SSE lines).
    """
    headers = {
        "Authorization": f"Bearer {bearer_token}",
        "Accept": "text/event-stream",
        "Content-Type": "application/json",
    }
    # The deployment already pins the model/params; just pass messages.
    payload = {"messages": messages}

    with requests.post(DEPLOYMENT_URL, headers=headers, json=payload, stream=True, timeout=300) as r:
        r.raise_for_status()
        # The endpoint returns Server-Sent Events lines prefixed with "data:"
        for raw_line in r.iter_lines(decode_unicode=True):
            if not raw_line:
                continue
            if raw_line.startswith("data:"):
                data = raw_line[len("data:"):].strip()
                if data == "[DONE]":
                    break
                try:
                    evt = json.loads(data)
                except json.JSONDecodeError:
                    # If a plain chunk arrives, yield as-is
                    yield data
                    continue

                # Common shapes:
                # evt = {"output":"text chunk"}  OR evt={"choices":[{"delta":{"content":"..."}}]}
                if isinstance(evt, dict):
                    if "output" in evt and isinstance(evt["output"], str):
                        yield evt["output"]
                    elif "choices" in evt and evt["choices"]:
                        delta = evt["choices"][0].get("delta", {})
                        chunk = delta.get("content")
                        if chunk:
                            yield chunk

def main():
    print("watsonx.ai chat — type your message. Ctrl+C to exit.")
    token = get_iam_token(API_KEY)

    # Start the conversation with a system message
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    while True:
        try:
            user_msg = input("\nYou: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nBye!")
            break

        if not user_msg:
            continue

        messages.append({"role": "user", "content": user_msg})

        print("Assistant: ", end="", flush=True)
        assistant_text = []
        try:
            for chunk in stream_chat(messages, token):
                assistant_text.append(chunk)
                print(chunk, end="", flush=True)
            print()  # newline
        except requests.HTTPError as e:
            print(f"\n[HTTP error] {e.response.status_code}: {e.response.text}")
            continue
        except Exception as e:
            print(f"\n[Error] {e}")
            continue

        full = "".join(assistant_text).strip()
        if full:
            messages.append({"role": "assistant", "content": full})

if __name__ == "__main__":
    main()
