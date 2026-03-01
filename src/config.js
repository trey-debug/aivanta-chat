// ============================================
// AIVANTA — Backend Configuration
// DO NOT change any URLs
// ============================================

export const CONFIG = {
  TEXT_WEBHOOK_URL:  'https://treymccormick.app.n8n.cloud/webhook/aivanta-chat',
  VOICE_WEBHOOK_URL: 'https://treymccormick.app.n8n.cloud/webhook/aivanta-voice',
  ENABLE_DEBUG:      true,
  SESSION_TIMEOUT:   30 * 60 * 1000, // 30 minutes
  WELCOME_MESSAGE:
    "Hi! I'm Alex, AIVANTA's AI shop advisor. I help auto repair shops recover lapsed customers, follow up on declined services, and free advisors from warranty phone tag. Tell me about your shop — how many advisors do you have, and what's your biggest bottleneck right now?",
}

export const SUPABASE_CONFIG = {
  URL:      'https://xjchoisgltitxtyivuwe.supabase.co',
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqY2hvaXNnbHRpdHh0eWl2dXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5Mzg5NjksImV4cCI6MjA4NjUxNDk2OX0.x8YFAHV0iIkNOZVcZGLstrzlRz5BRUtv6k9uBriVTFs',
}

export const ACKNOWLEDGMENTS = [
  "Let me think about that...",
  "Good question, give me a moment...",
  "Hmm, let me look into that...",
  "Great question, working on it...",
  "Got it, one sec...",
  "Interesting, let me dig into that...",
  "Sure thing, let me work on that...",
]
