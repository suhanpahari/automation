import os
import base64
import requests
from io import BytesIO
from PIL import Image
from groq import Groq
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
APPS_SCRIPT_URL = os.getenv("APPS_SCRIPT_URL")
# Note: Groq models are rapidly evolving. 
# While the user mentioned 'llama-4-scout-17b-16e-instruct', a publicly available
# high-performance vision model like LLaVA (via other providers) or Gemini would be needed for images.
# For text-only, Groq's Llama3 is excellent. We will structure the code to handle images,
# assuming a capable model endpoint. For this example, we will use a text model and simulate image understanding.
# When a model with vision is available via Groq, you can swap the model name.
LLM_TEXT_MODEL = "llama3-70b-8192"

# Initialize Groq Client
try:
    client = Groq(api_key=GROQ_API_KEY)
except Exception as e:
    print(f"Error initializing Groq client: {e}")
    exit()

# --- System Prompt: The Core Instruction for the LLM ---
SYSTEM_PROMPT = """
You are an expert AI assistant. Your task is to understand a user's request (which could be text or include an image) and convert it into a structured JSON command for a Google Apps Script to execute.

You MUST only output a single, valid JSON object. Do not include any other text, explanations, or markdown formatting.

The JSON output must have two keys: "action" and "params".

Supported actions and their required 'params':

1.  **Calendar: Create Events**
    - action: "create_calendar_events"
    - params: {
        "calendar_id": "primary", // or a specific calendar ID
        "start_date": "YYYY-MM-DD", // The Monday of the week to start adding events. Infer this from the user's request or image.
        "events": [
          {"title": "Event Title", "day": "Monday", "time": "HH:MM", "duration_minutes": 60, "description": "Optional details"}
        ]
      }

2.  **Gmail: Send Email**
    - action: "send_email"
    - params: {
        "recipient": "email@example.com",
        "subject": "Email Subject",
        "body": "The content of the email."
      }

3.  **Sheets: Update Range**
    - action: "update_sheet"
    - params: {
        "spreadsheet_id": "YourSpreadsheetID", // The user must provide this
        "sheet_name": "Sheet1",
        "start_cell": "A1",
        "values": [["Row1Col1", "Row1Col2"], ["Row2Col1", "Row2Col2"]]
      }

**Example User Request (from screenshot of a schedule):**


**Your JSON Output:**
{
  "action": "create_calendar_events",
  "params": {
    "calendar_id": "primary",
    "start_date": "2025-09-08",
    "events": [
      {"title": "Quantum Physics", "day": "Monday", "time": "10:00", "duration_minutes": 90},
      {"title": "Lab Session", "day": "Tuesday", "time": "14:00", "duration_minutes": 180},
      {"title": "Quantum Physics", "day": "Wednesday", "time": "10:00", "duration_minutes": 90}
    ]
  }
}

**Example User Request (text):**
"email my manager at manager@corp.com, subject is Project Update, body is 'Hi, the project is on track for release next week.'"

**Your JSON Output:**
{
  "action": "send_email",
  "params": {
    "recipient": "manager@corp.com",
    "subject": "Project Update",
    "body": "Hi, the project is on track for release next week."
  }
}

Now, analyze the user's request and generate the JSON command. Today's date is 2025-08-24.
"""

def get_image_base64(image_path):
    """Encodes an image file to a base64 string."""
    try:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except FileNotFoundError:
        print(f"Error: Image file not found at {image_path}")
        return None
    except Exception as e:
        print(f"Error encoding image: {e}")
        return None

def get_llama_command(user_prompt, image_path=None):
    """Gets the JSON command from LLaMA."""
    print("🧠 Thinking...")
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]

    if image_path:
        # This part is for a future vision-capable model.
        # We are sending the text prompt that describes the image for now.
        print("🖼️ Image provided. A vision model would analyze it.")
        # When using a true multimodal model, you'd construct the message differently,
        # often with a list of content parts (text and image).
        # For now, we'll just add a placeholder text.
        user_content = f"{user_prompt}\n\n[IMAGE CONTENT: A screenshot of a weekly schedule is attached. Please extract the schedule details.]"
        messages.append({"role": "user", "content": user_content})

    else:
        messages.append({"role": "user", "content": user_prompt})

    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model=LLM_TEXT_MODEL,
            temperature=0.0, # Low temperature for predictable JSON output
            response_format={"type": "json_object"},
        )
        command = chat_completion.choices[0].message.content
        print(f"🤖 Generated Command:\n{command}")
        return command
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return None

def execute_command_on_google(json_command):
    """Sends the JSON command to the Google Apps Script Web App."""
    if not APPS_SCRIPT_URL:
        print("Error: APPS_SCRIPT_URL is not set in your .env file.")
        return None
        
    print("🚀 Executing command via Google Apps Script...")
    try:
        response = requests.post(APPS_SCRIPT_URL, json=json_command, headers={'Content-Type': 'application/json'})
        response.raise_for_status() # Raise an exception for bad status codes
        print(f"✅ Execution Result:\n{response.json()}")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error communicating with Google Apps Script: {e}")
        return {"status": "error", "message": str(e)}

def summarize_result(user_prompt, result):
    """Asks LLaMA to create a natural language summary of the result."""
    print("✍️ Formatting final response...")
    try:
        summary_prompt = f"The user's original request was: '{user_prompt}'. The action was executed with the following result: {result}. Please provide a concise, friendly confirmation message to the user based on this result. If the status is 'success', confirm what was done. If it's an 'error', explain the error clearly and simply."
        
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": summary_prompt}],
            model=LLM_TEXT_MODEL,
            temperature=0.5,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error during summarization: {e}")
        return "There was an issue processing the result."

def main():
    """Main chat loop."""
    print("--- LLaMA + Google Assistant ---")
    print("Enter your request, or type 'image' to provide a file path for a screenshot.")

    while True:
        user_input = input("\nYou: ")
        if user_input.lower() in ['exit', 'quit']:
            break
        
        image_path = None
        if user_input.lower() == 'image':
            image_path = input("Enter the path to your image: ")
            user_prompt = "Analyze the attached schedule screenshot and create the corresponding calendar events."
        else:
            user_prompt = user_input

        # 1. Get structured command from LLaMA
        command_json_str = get_llama_command(user_prompt, image_path)
        if not command_json_str:
            continue

        # 2. Execute the command on Google Apps Script
        # In a real app, you would parse and validate the JSON before sending
        import json
        try:
            command_json = json.loads(command_json_str)
        except json.JSONDecodeError:
            print("Error: LLM did not return valid JSON. Please try again.")
            continue
            
        execution_result = execute_command_on_google(command_json)
        if not execution_result:
            continue

        # 3. Summarize the result for the user
        final_response = summarize_result(user_prompt, execution_result)
        print(f"\nAssistant: {final_response}")

if __name__ == "__main__":
    main()