import os
import requests

GROQ_API_KEY = os.getenv("GROQ_API_KEY") or "your_actual_groq_api_key"

headers = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json"
}
payload = {
    "model": "llama-3.1-8b-instant",
    "messages": [
        {"role": "system", "content": "Say hello."},
        {"role": "user", "content": "Hello!"}
    ],
    "temperature": 0
}

response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
print("Status code:", response.status_code)
print("Response:", response.json())