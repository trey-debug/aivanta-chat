# AIVANTA Frontend

Single-page landing site for AIVANTA, an AI automation consultancy targeting small/mid-size businesses. Cinematic dark theme, no build tools required — pure HTML/CSS/JS.

**Live:** Deployed via Vercel (static files, no framework)
**n8n Cloud:** https://treymccormick.app.n8n.cloud

---

## What This Is

A conversion-focused landing page with three interactive features:
1. **Text chat overlay** — talk to "Alex" (AI assistant) via n8n webhook
2. **Voice chat overlay** — record audio, send to n8n, get audio response back
3. **Discovery call form** — lead capture form that POSTs to n8n webhook

The page scrolls through: Hero (video bg) > Problem > Meet Alex > Cinematic Break > Solution > AI Comparison (data table) > Process Timeline > Manifesto > Pricing > Final CTA (video bg).

---

## Files

```
aivanta-frontend/
├── index.html      # Full page structure (all sections + 3 overlay modals)
├── styles.css      # ~1200 lines — dark glassmorphism theme, cinematic layout
├── script.js       # ~960 lines — chat, voice, parallax, scroll animations
└── assets/
    ├── 14690766_3840_2160_30fps.mp4   # Hero background video
    ├── 14690772_3840_2160_30fps.mp4   # Final CTA background video
    ├── 14340558_1440_2560_60fps.mp4   # Spare video (not currently used)
    ├── pexels-alex-dos-santos-*.jpg   # Cinematic break image (lone figure)
    ├── pexels-flickr-156787.jpg       # Process section bg (mountain peaks)
    ├── pexels-septimiu-lupea-*.jpg    # Comparison section bg (mountain lake)
    ├── manifesto-bg.jpg               # Manifesto section bg
    └── wave-bg.jpg                    # Spare (not currently used)
```

---

## Architecture

### Page Sections (scroll order)
| # | Section | Key CSS Class | Notes |
|---|---------|---------------|-------|
| 1 | Hero | `.section-hero` | Fullscreen video bg + particle canvas overlay |
| 2 | Problem | `.section-problem` | 4 problem cards in grid |
| 3 | Meet Alex | `.section-meet-alex` | CTA to open text/voice chat |
| — | Cinematic Break | `.cinematic-break` | Full-bleed parallax image between sections |
| 4 | Solution | `.section-solution` | 3 solution cards (AI agents) |
| 5 | Comparison | `.section-comparison` | 3-col data grid with image bg, "AI vs Non-AI" |
| 6 | Process | `.section-process` | 4-step timeline with image bg |
| 7 | Manifesto | `.section-manifesto` | Quote with image bg |
| 8 | Pricing | `.section-pricing` | Single plan: $1,000 total for 16-week program |
| 9 | Final CTA | `.section-final` | Video bg, 3 CTAs (discovery, text chat, voice chat) |

### Overlay Modals (opened via JS, not separate pages)
| Overlay | Trigger Elements | ID |
|---------|------------------|----|
| Text Chat | "Talk to Alex", "Chat with Alex" buttons | `#text-chat` |
| Voice Chat | "Talk to Alex Live" buttons | `#voice-chat` |
| Discovery Form | "Book Your Discovery Call" buttons | `#discovery-form` |

### Design System
- **Theme:** Dark (#0A0A0F base) with cyan accent (#00B4D8)
- **Font:** Outfit (Google Fonts)
- **Cards:** Glassmorphism (backdrop-filter blur, semi-transparent bg)
- **Images:** Cinematic full-bleed — images serve as section backgrounds or viewport-width parallax breaks, not standalone boxed elements
- **Animations:** Scroll-triggered fade-up (IntersectionObserver), parallax image shift, counter animation for stats

---

## Webhook Integration (n8n)

### Text Chat
- **Endpoint:** `POST https://treymccormick.app.n8n.cloud/webhook/aivanta-chat`
- **Payload:** `{ message: "user text", sessionId: "sess_xxx" }`
- **Response:** `{ response: "AI reply" }` (also accepts `output`, `text`, `message` fields)

### Voice Chat
- **Endpoint:** `POST https://treymccormick.app.n8n.cloud/webhook/aivanta-voice`
- **Greeting:** `{ action: "greeting", sessionId: "sess_xxx" }` (JSON)
- **Recording:** FormData with `file` (audio blob) + `sessionId`
- **Response:** Audio blob (Content-Type: audio/*) with `x-transcript` header, or JSON fallback

### Discovery Form
- **Endpoint:** `POST https://treymccormick.app.n8n.cloud/webhook/aivanta-discovery`
- **Payload:** `{ name, email, phone, business, industry, revenue, message }`

---

## JS Configuration

All settings in `CONFIG` object at top of `script.js`:

| Key | Value | Purpose |
|-----|-------|---------|
| `TEXT_WEBHOOK_URL` | `…/webhook/aivanta-chat` | Text chat backend |
| `VOICE_WEBHOOK_URL` | `…/webhook/aivanta-voice` | Voice chat backend |
| `ENABLE_DEBUG` | `true` | Console logging with `[AIVANTA]` prefix |
| `SESSION_TIMEOUT` | 30 min | localStorage chat persistence |
| `WELCOME_MESSAGE` | Alex's greeting | First message in text chat |

---

## Key JS Features

- **Session persistence** — chat history saved to localStorage, restored on revisit (30 min TTL)
- **Parallax scroll** — `.parallax-img` elements shift with viewport position (respects `prefers-reduced-motion`)
- **Scroll animations** — `.anim-fade-up` elements fade in via IntersectionObserver, `data-delay` attribute for stagger
- **Counter animation** — `.stat-number[data-target]` counts up when visible (currently unused after comparison table replaced stats)
- **Lazy video loading** — videos with `preload="none"` load when near viewport
- **Hero particle canvas** — animated connected dots on `#hero-particles`
- **Audio playback** — voice responses decoded and played via Web Audio API

---

## CSS Customization

Edit `:root` variables in `styles.css`:
- **Colors:** `--bg`, `--accent`, `--text`
- **Spacing/Radius:** `--radius-sm` through `--radius-xl`
- **Glass effect:** `--glass-bg`, `--glass-border`, `--glass-shadow`

---

## Deployment

Static files — no build step. Deploy anywhere:

```bash
# Vercel
npx vercel

# Netlify
# Drag aivanta-frontend/ folder to app.netlify.com/drop

# Any static host
# Just upload index.html, styles.css, script.js, and assets/
```

---

## Current State & Known Context

- **Pricing:** $1,000 total (one-time, not monthly) for the 16-week program
- **CTA language:** "Book Your Discovery Call" (not "Book Free Audit")
- **Comparison section** replaced the old "Results/Stats" section — now shows AI vs non-AI data from McKinsey, Salesforce, Deloitte, HBR
- **Cinematic layout:** Images are full-bleed viewport-width breaks or section backgrounds with gradient overlays — not boxed standalone elements
- **Meet Alex section** was added between Problem and the cinematic break
- **Discovery call form overlay** was added as a third overlay (alongside text chat and voice chat)
- The n8n workflows for chat/voice/discovery are configured on https://treymccormick.app.n8n.cloud

**Last Updated:** 2026-02-11
