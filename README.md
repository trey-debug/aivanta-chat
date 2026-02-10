# AIVANTA Frontend

AI-powered chat interface for lead qualification. Connects to an n8n webhook backend.

## Quick Start

1. Open `index.html` in your browser — it works immediately with no build step.
2. Update the webhook URL in `script.js` (line 10):

```js
N8N_WEBHOOK_URL: 'https://treymccormick.app.n8n.cloud/webhook/YOUR-WEBHOOK-ID',
```

3. Start chatting.

## Project Structure

```
aivanta-frontend/
├── index.html   — Main HTML (hero + chat + voice screens)
├── styles.css   — All styling (dark glassmorphism theme)
├── script.js    — Chat logic, API calls, state management
├── README.md    — This file
└── .gitignore   — Git ignore rules
```

## Configuration

All settings live in the `CONFIG` object at the top of `script.js`:

| Key | Description | Default |
|-----|-------------|---------|
| `N8N_WEBHOOK_URL` | Your n8n webhook endpoint | Must be set |
| `ENABLE_DEBUG` | Console logging | `true` |
| `SESSION_TIMEOUT` | How long sessions persist in localStorage | 30 minutes |
| `WELCOME_MESSAGE` | Alex's opening message | Pre-configured |

## n8n Webhook Format

**Request (POST):**
```json
{
  "chatInput": "User message",
  "conversationHistory": [
    { "role": "assistant", "content": "..." },
    { "role": "user", "content": "..." }
  ],
  "sessionId": "sess_abc123"
}
```

**Expected Response:**
```json
{
  "response": "AI response text"
}
```

The frontend also handles `output`, `text`, `message`, and plain string responses.

## Deploy to Vercel

```bash
npm i -g vercel
cd aivanta-frontend
vercel
```

Or push to GitHub and import the repo in the Vercel dashboard. No framework settings needed — it serves static files.

## Deploy to Netlify

Drag and drop the `aivanta-frontend` folder into [app.netlify.com/drop](https://app.netlify.com/drop).

## Features

- Text chat with full conversation history
- Real-time message sending/receiving via n8n webhook
- Loading states with animated typing indicator
- Session persistence in localStorage
- Copy and clear conversation
- Responsive design (mobile, tablet, desktop)
- Glassmorphism dark theme with smooth animations
- Voice chat placeholder UI (ready to wire up with Vapi.ai)
- Accessible (ARIA labels, focus styles, semantic HTML)

## Customization

- **Colors:** Edit CSS custom properties in `:root` at the top of `styles.css`
- **Welcome message:** Change `CONFIG.WELCOME_MESSAGE` in `script.js`
- **Branding:** Update logo text in `index.html` (`<h1 class="logo">`)
