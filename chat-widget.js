import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

// ── Initialize n8n Chat (cloud connection intact) ──────────────────────────
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
                title: '',
                subtitle: '',
                getStarted: 'Start Chat',
                inputPlaceholder: 'Type a message...'
            }
        }
    });
} catch (e) {
    console.error('Chat init failed:', e);
}

// ── After n8n injects the iframe, hide the loading spinner ─────────────────
const inner   = document.getElementById('n8n-chat-inner');
const spinner = document.getElementById('chat-spinner');

if (inner) {
    const spinnerObserver = new MutationObserver(() => {
        if (inner.querySelector('iframe') && spinner) {
            spinner.style.display = 'none';
            spinnerObserver.disconnect();
        }
    });
    spinnerObserver.observe(inner, { childList: true, subtree: true });
}

// ── Inject WhatsApp theme into the n8n iframe once it loads ───────────────
function injectWATheme() {
    if (!inner) return;
    let attempts = 0;
    const iv = setInterval(() => {
        attempts++;
        const iframe = inner.querySelector('iframe');
        if (iframe) {
            try {
                const doc = iframe.contentWindow.document;
                if (!doc.getElementById('wa-theme')) {
                    const s = doc.createElement('style');
                    s.id = 'wa-theme';
                    s.textContent = `
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                        *, *::before, *::after {
                            font-family: 'Inter', -apple-system, sans-serif !important;
                            box-sizing: border-box !important;
                        }

                        /* Root & body */
                        html, body { background: #EFE7DD !important; margin: 0 !important; height: 100% !important; overflow: hidden !important; }

                        /* n8n wraps everything in these */
                        .n8n-chat,
                        .n8n-chat__layout,
                        .chat-layout         { background: #EFE7DD !important; height: 100% !important; display: flex !important; flex-direction: column !important; }

                        /* ── HIDE everything n8n renders above the messages ── */
                        /* Header bar */
                        .chat-header,
                        .n8n-chat__header { display: none !important; }

                        /* Welcome / intro screen with big title */
                        .chat-welcome-screen,
                        .n8n-chat__welcome,
                        .chat-welcome,
                        [class*="welcome"],
                        [class*="Welcome"] { display: none !important; }

                        /* Any stray heading n8n injects at top level */
                        body > div > h1, body > div > h2, body > div > p,
                        .n8n-chat > h1, .n8n-chat > h2, .n8n-chat > p,
                        .n8n-chat__layout > h1,
                        .n8n-chat__layout > h2,
                        .n8n-chat__layout > p { display: none !important; }

                        /* The "get started" button that shows before chat opens */
                        [class*="getStarted"],
                        [class*="get-started"],
                        [class*="start-button"] { display: none !important; }

                        /* Messages area */
                        .chat-messages-list,
                        .n8n-chat__messages  { background: #EFE7DD !important; padding: 14px 12px !important; flex: 1 !important; overflow-y: auto !important; }

                        /* Bot bubble */
                        .chat-message--from-bot .chat-message__text,
                        .n8n-chat__message--incoming .n8n-chat__message-text {
                            background: #fff !important;
                            color: #111 !important;
                            border-radius: 0 10px 10px 10px !important;
                            padding: 8px 12px !important;
                            box-shadow: 0 1px 2px rgba(0,0,0,0.18) !important;
                            max-width: 82% !important;
                            font-size: 14px !important;
                            line-height: 1.45 !important;
                        }

                        /* User bubble */
                        .chat-message--from-user .chat-message__text,
                        .n8n-chat__message--outgoing .n8n-chat__message-text {
                            background: #DCF8C6 !important;
                            color: #111 !important;
                            border-radius: 10px 0 10px 10px !important;
                            padding: 8px 12px !important;
                            box-shadow: 0 1px 2px rgba(0,0,0,0.18) !important;
                            max-width: 82% !important;
                            font-size: 14px !important;
                            line-height: 1.45 !important;
                        }

                        /* Input footer area */
                        .chat-input,
                        .n8n-chat__input     { background: #F0F0F0 !important; border-top: 1px solid #ddd !important; padding: 10px 12px !important; }

                        /* Input field */
                        .chat-input__input,
                        .n8n-chat__input-field textarea,
                        .n8n-chat__input-field input {
                            background: #fff !important;
                            color: #111 !important;
                            border-radius: 22px !important;
                            border: none !important;
                            padding: 10px 16px !important;
                            font-size: 14px !important;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                            width: 100% !important;
                            resize: none !important;
                        }
                        .n8n-chat__input-field textarea::placeholder,
                        .n8n-chat__input-field input::placeholder { color: #aaa !important; }

                        /* Send button */
                        .chat-input__send-button,
                        .n8n-chat__send-button,
                        button[type="submit"] {
                            background: #25D366 !important;
                            border-radius: 50% !important;
                            width: 40px !important;
                            height: 40px !important;
                            flex-shrink: 0 !important;
                            border: none !important;
                            color: #fff !important;
                            cursor: pointer !important;
                            transition: background 0.2s !important;
                        }
                        .chat-input__send-button:hover,
                        .n8n-chat__send-button:hover { background: #1db954 !important; }

                        /* Hide n8n powered-by footer */
                        .n8n-chat__powered-by,
                        .chat-powered-by     { display: none !important; }
                    `;
                    doc.head.appendChild(s);
                    clearInterval(iv);
                }
            } catch (_) { /* cross-origin or still loading */ }
        }
        if (attempts > 150) clearInterval(iv);
    }, 100);
}

// Inject theme on first open and every subsequent open
const chatWindow = document.getElementById('n8n-chat-window');
if (chatWindow) {
    const openObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type === 'attributes' && chatWindow.classList.contains('open')) {
                injectWATheme();
            }
        }
    });
    openObserver.observe(chatWindow, { attributes: true, attributeFilter: ['class'] });
}
