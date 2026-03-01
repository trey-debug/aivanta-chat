# AIVANTA Frontend — The 90-Day AI Supercharged Shop

Landing page for AIVANTA Automations, LLC — a done-for-you AI automation agency built exclusively for automotive repair shops. Cinematic dark theme, no build tools, pure HTML/CSS/JS.

**Live:** Deployed via Vercel (static files, no framework)
**n8n Cloud:** https://treymccormick.app.n8n.cloud
**Website:** www.aivantaautomations.com

---

## What This Is

A conversion-focused landing page targeting independent auto repair shop owners ($750K–$5M revenue) with three interactive features:

1. **Text chat overlay** — talk to "Alex" (AI shop advisor) via n8n webhook
2. **Voice chat overlay** — record audio, send to n8n, receive audio response
3. **Discovery call form** — lead capture form that POSTs to n8n webhook

### Core Offer: The 90-Day AI Supercharged Shop

Five AI automations built directly into the shop's existing platforms (Tekmetric, Shopmonkey, myKaarma, etc.):

| Automation | Pain Solved |
|---|---|
| AI Scheduling Agent | Bad bookings — wrong time slots, unprepared bays |
| Tech Video Summarizer | Advisors watching DVI videos before calling customers |
| Declined Service Follow-Up | 10–15 declined jobs/week never followed up on |
| Customer Re-Engagement | Lapsed customers never contacted again |
| Warranty Claim Prep Pack | 1–2 hrs of hold time per claim assembling docs |

**The guarantee:** 10 lapsed customers back in 90 days — or we work free until it happens.

---

## Page Architecture (scroll order)

| # | Section | Key CSS Class | Notes |
|---|---------|---------------|-------|
| 1 | Hero | `.section-hero` | Fullscreen video bg + particle canvas overlay |
| 2 | Problem | `.section-problem` | 4 pain points with annual cost figures |
| 3 | Meet Alex | `.section-meet-alex` | CTA to open text/voice chat |
| — | Cinematic Break | `.cinematic-break` | Full-bleed parallax image |
| 4 | Solution | `.section-solution` | 5 automation cards |
| 5 | Comparison | `.section-comparison` | AI shop vs. traditional shop data table |
| 6 | Process | `.section-process` | 90-Day timeline (4 steps) |
| 7 | Manifesto | `.section-manifesto` | Founder / BMW technician origin story |
| 8 | Pricing | `.section-pricing` | 3-tier: Starter / Growth / Transformation |
| 9 | Final CTA | `.section-final` | Video bg, 3 CTAs |

### Overlay Modals

| Overlay | Trigger Elements | ID |
|---------|------------------|----|
| Text Chat | "Talk to Alex", "Chat with Alex" buttons | `#text-chat` |
| Voice Chat | "Talk to Alex Live" buttons | `#voice-chat` |
| Discovery Form | "Book Your Discovery Call" buttons | `#discovery-form` |

---

## Files

```
aivanta-frontend/
├── index.html      # Full page structure (all sections + 3 overlay modals)
├── styles.css      # Dark glassmorphism theme, cinematic layout
├── script.js       # Chat, voice, parallax, scroll animations
└── assets/
    ├── 14690766_3840_2160_30fps.mp4   # Hero background video
    ├── 14690772_3840_2160_30fps.mp4   # Final CTA background video
    ├── 14340558_1440_2560_60fps.mp4   # Spare video (unused)
    ├── AIVANTA_Auto_Tech_Stack_Research.md    # Integration research doc
    ├── AIVANTA_Business_Framework_Report.md   # Hormozi frameworks doc
    ├── AIVANTA_Strategic_Business_Plan_2026.md # Full business plan
    ├── pexels-alex-dos-santos-*.jpg   # Cinematic break image
    ├── pexels-flickr-156787.jpg       # Process section bg
    ├── pexels-septimiu-lupea-*.jpg    # Comparison section bg
    ├── manifesto-bg.jpg               # Manifesto section bg
    └── wave-bg.jpg                    # Spare (unused)
```

> **Images:** Placeholder stock images are currently in use. Automotive-specific images (shop floor, advisor with customer, tech at vehicle) will replace these when sourced. All images are loaded via Cloudinary CDN.

---

## Pricing Architecture

Three tiers mapped to shop size and revenue:

| Tier | Target | Setup | Monthly | 36-Month Value |
|---|---|---|---|---|
| **Starter** | 1–3 advisors, <$1M | $1,500 | $597/mo | ~$23,000 |
| **Growth** | 3–5 advisors, $1M–$3M | $3,000 | $997/mo | ~$38,900 |
| **Transformation** | 5+ advisors, $3M+ | $8,000 | $1,497/mo | ~$61,900 |

---

## Design System

- **Theme:** Dark (`#0A0A0F` base) with cyan accent (`#00B4D8`)
- **Font:** Outfit (Google Fonts)
- **Cards:** Glassmorphism (backdrop-filter blur, semi-transparent bg)
- **Images:** Cinematic full-bleed — images are section backgrounds or viewport-width parallax breaks
- **Animations:** Scroll-triggered fade-up (IntersectionObserver), parallax image shift

### Key CSS Variables (`:root` in `styles.css`)

| Variable | Value | Purpose |
|---|---|---|
| `--bg` | `#0A0A0F` | Page background |
| `--accent` | `#00B4D8` | Cyan — buttons, highlights, numbers |
| `--text` | `#EAEAF0` | Primary text |
| `--text-secondary` | `#8E8EA0` | Body copy |
| `--success` | `#00D68F` | Pricing checkmarks |

---

## Webhook Integration (n8n)

### Text Chat
- **Endpoint:** `POST https://treymccormick.app.n8n.cloud/webhook/aivanta-chat`
- **Payload:** `{ message: "user text", sessionId: "sess_xxx" }`
- **Response:** `{ response: "AI reply" }`

### Voice Chat
- **Endpoint:** `POST https://treymccormick.app.n8n.cloud/webhook/aivanta-voice`
- **Greeting:** `{ action: "greeting", sessionId: "sess_xxx" }` (JSON)
- **Recording:** FormData with `file` (audio blob) + `sessionId`
- **Response:** Audio blob (`Content-Type: audio/*`) with `x-transcript` header, or JSON fallback

### Discovery Form
- **Endpoint:** `POST https://treymccormick.app.n8n.cloud/webhook/aivanta-discovery`
- **Payload:** `{ name, email, phone, business, industry, revenue, message }`
- **Industry Options (automotive):** independent-shop, multi-location, dealership-service, specialty-performance, tire-service

---

## JS Configuration

All settings in `CONFIG` object at top of `script.js`:

| Key | Value | Purpose |
|-----|-------|---------|
| `TEXT_WEBHOOK_URL` | `…/webhook/aivanta-chat` | Text chat backend |
| `VOICE_WEBHOOK_URL` | `…/webhook/aivanta-voice` | Voice chat backend |
| `ENABLE_DEBUG` | `true` | Console logging with `[AIVANTA]` prefix |
| `SESSION_TIMEOUT` | 30 min | localStorage chat persistence TTL |
| `WELCOME_MESSAGE` | Alex's automotive greeting | First message in text chat |

---

## Key JS Features

- **Session persistence** — chat history saved to localStorage, restored on revisit (30 min TTL)
- **Parallax scroll** — `.parallax-img` elements shift with viewport position (respects `prefers-reduced-motion`)
- **Scroll animations** — `.anim-fade-up` elements fade in via IntersectionObserver, `data-delay` for stagger
- **Hero particle canvas** — animated connected dots on `#hero-particles`
- **Audio playback** — voice responses decoded and played via Web Audio API
- **Supabase analytics** — tracks page views, chat sessions, and discovery form submissions

---

## SMS Integration Targets

The site's automations reference these shop management platforms:

| Platform | API Status | Priority |
|---|---|---|
| Tekmetric | Full REST API + Webhooks | ⭐⭐⭐ Critical |
| Shopmonkey | Full REST API + Webhooks | ⭐⭐⭐ Critical |
| myKaarma (DVI) | Full REST API | ⭐⭐⭐ Critical |
| Shop-Ware | Partner API | ⭐⭐ High |
| CDK Global (via Fortellis) | Full REST + Async Events | ⭐⭐⭐ High (dealer market) |

See [`assets/AIVANTA_Auto_Tech_Stack_Research.md`](assets/AIVANTA_Auto_Tech_Stack_Research.md) for the complete integration map.

---

## Deployment

Static files — no build step:

```bash
# Vercel (current)
npx vercel

# Netlify
# Drag aivanta-frontend/ to app.netlify.com/drop

# Any static host
# Upload index.html, styles.css, script.js, and assets/
```

---

## Current State

- **Offer:** 90-Day AI Supercharged Shop — 3 tiers (Starter $597/mo, Growth $997/mo, Transformation $1,497/mo)
- **Guarantee:** 10 lapsed customers back in 90 days or AIVANTA works free
- **Vertical:** Automotive repair shops — independent, multi-location, dealerships
- **CTA:** "Book Your Discovery Call" (opens discovery form overlay)
- **Analytics:** Live Supabase tracking of visits, sessions, and leads

**Last Updated:** 2026-02-22
