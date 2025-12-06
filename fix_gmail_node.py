import json

file_path = "n8n_automation_workflow.json"

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Update Gmail Nodes to have expression-level fallbacks
for node in data.get('nodes', []):
    if node.get('name') == 'Send to Client':
        # Use a ternary operator in the expression to guarantee a value
        node['parameters']['toEmail'] = '={{ $json["toEmail"] ? $json["toEmail"] : "solidiaai@gmail.com" }}'
        print("Updated 'Send to Client' node expression.")
    
    if node.get('name') == 'Send to Admin':
         node['parameters']['toEmail'] = '={{ $json["adminEmail"] ? $json["adminEmail"] : "solidiaai@gmail.com" }}'
         print("Updated 'Send to Admin' node expression.")

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("JSON file updated successfully.")
