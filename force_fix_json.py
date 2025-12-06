import json

file_path = "n8n_automation_workflow.json"

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# The new robust function code
new_function_code = r"""// Format data for email
const data = items[0].json;

// Colors based on website
const colors = {
    bg: '#111827', // gray-900
    card: '#1f2937', // gray-800
    text: '#f3f4f6', // gray-100
    accent: '#2563eb', // blue-600
    border: '#374151' // gray-700
};

const logoUrl = 'https://raw.githubusercontent.com/Lyhack27/solidIA2.0/main/logo/logo.png';

// Smart Data Extraction (Flat or Nested)
const contact = data.contact || {};
const firstName = contact.firstName || data.firstName || data.name || 'Unknown';
const lastName = contact.lastName || data.lastName || '';
const fullName = `${firstName} ${lastName}`.trim();

// Robust Email Logic
// If data was flattened or structured differently, check deeply
let email = contact.email || data.email;

// Validation: Must be string, not empty, must contain '@'
if (!email || typeof email !== 'string' || !email.includes('@')) {
    email = 'solidiaai@gmail.com'; // CRITICAL FALLBACK
}

const phone = contact.phone || data.phone || 'N/A';
const message = data.message || contact.message || 'No message provided';

let subject = '';
let content = '';

// Helper for styled rows
const row = (label, value) => `
    <div style="margin-bottom: 12px;">
        <span style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">${label}</span>
        <span style="color: ${colors.text}; font-size: 16px; font-weight: 500;">${value || 'N/A'}</span>
    </div>
`;

if (data.serviceType === 'General Inquiry (Intro Form)') {
    subject = `New General Inquiry: ${fullName}`;
    content = `
        <h2 style="color: ${colors.accent}; margin-top: 0;">General Inquiry</h2>
        ${row('Name', fullName)}
        ${row('Email', email)}
        ${row('Phone', phone)}
        ${row('Message', message)}
    `;
} else if (data.serviceType === 'AI Brainstormer Request') {
    subject = `New AI Brainstormer Request`;
    content = `
        <h2 style="color: ${colors.accent}; margin-top: 0;">AI Brainstormer Request</h2>
        ${row('Details', message)}
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid ${colors.border};">
             ${row('Contact Name', fullName)}
             ${row('Contact Email', email)}
        </div>
    `;
} else {
    // Chatbot Quote Request or Default
    subject = `New Quote Request: ${data.business ? data.business.needType : 'General'}`;
    content = `
        <h2 style="color: ${colors.accent}; margin-top: 0;">New Quote Request</h2>
        
        <div style="background-color: ${colors.bg}; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: white; margin-top: 0; margin-bottom: 15px; font-size: 14px; border-bottom: 1px solid ${colors.border}; padding-bottom: 8px;">Business Details</h3>
            ${row('Business Type', data.business ? data.business.businessType : 'N/A')}
            ${row('Need', data.business ? data.business.needType : 'N/A')}
            ${row('Additional Details', data.business ? data.business.message : 'N/A')}
        </div>

        <div style="background-color: ${colors.bg}; padding: 15px; border-radius: 6px;">
            <h3 style="color: white; margin-top: 0; margin-bottom: 15px; font-size: 14px; border-bottom: 1px solid ${colors.border}; padding-bottom: 8px;">Contact Information</h3>
            ${row('Name', fullName)}
            ${row('Email', email)}
            ${row('Phone', phone)}
        </div>
    `;
}

// Full HTML Template
const body = `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: ${colors.bg}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: ${colors.card}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); font-family: sans-serif;">
        <!-- Header -->
        <div style="background-color: ${colors.bg}; padding: 30px; text-align: center; border-bottom: 1px solid ${colors.border};">
            <img src="${logoUrl}" alt="solid AI Logo" style="height: 50px; width: auto;">
        </div>
        
        <!-- Content -->
        <div style="padding: 40px;">
            ${content}
        </div>
        
        <!-- Footer -->
        <div style="background-color: ${colors.bg}; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid ${colors.border};">
            <p style="margin: 0;">\u00a9 2024 solid AI. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">Automated by n8n</p>
        </div>
    </div>
</body>
</html>
`;

return [
    {
        json: {
            subject,
            body,
            toEmail: email,
            adminEmail: 'solidiaai@gmail.com'
        }
    }
];"""

# Replace in the specific node (Function node which is index 1 usually, checking by name)
for node in data.get('nodes', []):
    if node.get('name') == 'Format Email Data':
        node['parameters']['functionCode'] = new_function_code
        print("Updated Function Node code.")

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("JSON file updated successfully.")
