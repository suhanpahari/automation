import requests

# Replace this with your deployed Google Apps Script Web App URL
GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzjO4j8qkBvC9KPp0mwgc3qBS5osaI-05BTNb-db7w06ucgbCwstlGN5rRoUkd1QTeY/exec"

def add_event_to_calendar(date, text, start_time="09:00", duration=60):
    """
    Sends an event creation request to Google Apps Script Calendar API.

    Args:
        date (str): Date in 'YYYY-MM-DD' format.
        text (str): Event title.
        start_time (str): Start time in 'HH:MM' (24hr format). Default: 09:00.
        duration (int): Duration in minutes. Default: 60.

    Returns:
        dict: JSON response from Google Apps Script.
    """
    payload = {
        "command": "mark",
        "date": date,
        "text": text,
        "start_time": start_time,
        "duration": duration
    }

    try:
        response = requests.post(GOOGLE_SCRIPT_URL, json=payload)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"status": "error", "message": str(e)}


# Example usage
if __name__ == "__main__":
    # Example: Add a Hackathon event
    result = add_event_to_calendar(
        date="2025-08-25",
        text="Hackathon Registration",
        start_time="14:00",  # 2 PM
        duration=120          # 2 hours
    )
    print(result)
