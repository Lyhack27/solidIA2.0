import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

// Initialize Chat — keeps n8n cloud connection intact
try {
    createChat({
        webhookUrl: 'https://n8n.solidiaai.com/webhook/974f29f6-1eee-4e56-aabc-ccb9cccccaef/chat',
        target: '#n8n-chat-inner',
        chatInputKey: 'chatInput',
        chatSessionKey: 'sessionId',
        showWelcomeScreen: false,
        defaultLanguage: 'en',
        initialMessages: [],
        i18n: {
            en: {
                title: 'Solid AI',
                subtitle: 'AI Automation & Solutions',
                getStarted: 'Start Chat',
                inputPlaceholder: 'Type a message...'
            }
        },
        style: {
            backgroundColor: 'transparent',
            tokenColor: '#ffffff',
            secondaryColor: '#25D366'
        }
    });
} catch (e) {
    console.error('Chat initialization failed:', e);
}

// UI toggle logic
const btn = document.getElementById('n8n-chat-btn');
const win = document.getElementById('n8n-chat-window');
const inner = document.getElementById('n8n-chat-inner');

if (btn && win) {
    btn.addEventListener('click', () => {
        const isOpen = win.classList.contains('visible');

        if (isOpen) {
            win.classList.remove('visible');
        } else {
            win.classList.add('visible');

            // Inject WhatsApp-style theme into the n8n iframe
            let attempts = 0;
            const styleInterval = setInterval(() => {
                attempts++;
                const iframe = inner ? inner.querySelector('iframe') : win.querySelector('iframe');

                if (iframe) {
                    try {
                        const doc = iframe.contentWindow.document;

                        if (!doc.getElementById('wa-theme')) {
                            iframe.style.width = '100%';
                            iframe.style.height = '100%';
                            iframe.style.border = 'none';

                            const s = doc.createElement('style');
                            s.id = 'wa-theme';
                            s.textContent = `
                                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                                * { font-family: 'Inter', sans-serif !important; box-sizing: border-box; }

                                body { background: transparent !important; }

                                /* Container */
                                .n8n-chat-container { background: transparent !important; border: none !important; height: 100% !important; }

                                /* Header — WhatsApp dark green */
                                .n8n-chat-header {
                                    background: #075E54 !important;
                                    border-bottom: none !important;
                                    padding: 14px 16px !important;
                                }
                                .n8n-chat-header-title { color: #fff !important; font-size: 16px !important; font-weight: 600 !important; }
                                .n8n-chat-header-subtitle { color: rgba(255,255,255,0.75) !important; font-size: 12px !important; }

                                /* Messages area — WhatsApp wallpaper-like bg */
                                .n8n-chat-messages-list {
                                    background: #ECE5DD !important;
                                    padding: 16px 12px !important;
                                }

                                .n8n-chat-message-row { margin-bottom: 6px !important; }

                                /* Bot bubble — left, white */
                                .n8n-chat-message-row.bot .n8n-chat-message-content {
                                    background: #fff !important;
                                    color: #111 !important;
                                    border-radius: 0px 8px 8px 8px !important;
                                    padding: 8px 12px !important;
                                    box-shadow: 0 1px 2px rgba(0,0,0,0.15) !important;
                                    max-width: 80% !important;
                                    font-size: 14px !important;
                                }

                                /* User bubble — right, green */
                                .n8n-chat-message-row.user .n8n-chat-message-content {
                                    background: #DCF8C6 !important;
                                    color: #111 !important;
                                    border-radius: 8px 0px 8px 8px !important;
                                    padding: 8px 12px !important;
                                    box-shadow: 0 1px 2px rgba(0,0,0,0.15) !important;
                                    max-width: 80% !important;
                                    font-size: 14px !important;
                                }

                                /* Footer / Input area */
                                .n8n-chat-footer {
                                    background: #F0F0F0 !important;
                                    border-top: 1px solid #ddd !important;
                                    padding: 10px 12px !important;
                                }

                                .n8n-chat-input-container {
                                    background: #fff !important;
                                    border: none !important;
                                    border-radius: 24px !important;
                                    padding: 8px 8px 8px 16px !important;
                                    display: flex !important;
                                    align-items: center !important;
                                    box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                                }

                                .n8n-chat-input {
                                    background: transparent !important;
                                    color: #111 !important;
                                    font-size: 14px !important;
                                }
                                .n8n-chat-input::placeholder { color: #999 !important; }

                                /* Send button — WhatsApp green */
                                .n8n-chat-submit-button {
                                    width: 38px !important;
                                    height: 38px !important;
                                    background: #25D366 !important;
                                    border-radius: 50% !important;
                                    display: flex !important;
                                    align-items: center !important;
                                    justify-content: center !important;
                                    color: #fff !important;
                                    border: none !important;
                                    transition: background 0.2s !important;
                                    margin-left: 8px !important;
                                    flex-shrink: 0 !important;
                                }
                                .n8n-chat-submit-button:hover { background: #1ebe5d !important; }

                                /* Hide n8n branding */
                                .n8n-chat-powered-by { display: none !important; }
                            `;
                            doc.head.appendChild(s);
                            clearInterval(styleInterval);
                        }
                    } catch (e) {
                        // Cross-origin / still loading — keep trying
                    }
                }

                if (attempts > 100) clearInterval(styleInterval);
            }, 100);
        }
    });
} else {
    console.error('Chat elements not found: #n8n-chat-btn or #n8n-chat-window missing');
}
