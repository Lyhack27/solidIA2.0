import json
import requests
import sys

# Configuration
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZWNjNjdhMS05Njg3LTQ2MWItOTRhNi0yNzM3ODE3MzU1OTAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY0OTExMjg0LCJleHAiOjE3Njc1MDI4MDB9.LmmQNUDqx4E8yUbNYuGTEsROH4HyUlUMvOkUB5kfZKk"
WORKFLOW_ID = "lPc11aENeBAUnhpO"
URL = f"https://n8n.solidiaai.com/api/v1/workflows/{WORKFLOW_ID}"
FILE_PATH = "n8n_raziel_style.json"

# Read the workflow file
try:
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        workflow_data = json.load(f)
    
    # Ensure 'settings' field exists as required by API
    if 'settings' not in workflow_data:
        workflow_data['settings'] = {}
except Exception as e:
    print(f"Error reading file: {e}")
    sys.exit(1)

# Send PUT request
headers = {
    "X-N8N-API-KEY": API_KEY,
    "Content-Type": "application/json"
}

try:
    response = requests.put(URL, json=workflow_data, headers=headers)
    response.raise_for_status()
    print("Workflow updated successfully!")
    print("Server Response:")
    print(json.dumps(response.json(), indent=2))
except requests.exceptions.RequestException as e:
    print(f"Error updating workflow: {e}")
    if hasattr(e, 'response') and e.response is not None:
        print(f"Response content: {e.response.text}")
    sys.exit(1)
