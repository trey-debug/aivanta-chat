// ============================================
// Supabase helpers — migrated from script.js
// ============================================
import { SUPABASE_CONFIG } from '../config.js'

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_CONFIG.ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_CONFIG.ANON_KEY}`,
  'Prefer': 'return=minimal',
}

export function supabasePost(table, data) {
  return fetch(`${SUPABASE_CONFIG.URL}/rest/v1/${table}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  }).catch(() => {}) // Analytics failures should never break the UI
}

export function supabaseRpc(fn, params = {}) {
  return fetch(`${SUPABASE_CONFIG.URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  }).catch(() => {})
}

export function trackPageView(visitorId, section = null) {
  return supabasePost('page_views', {
    visitor_id: visitorId,
    page_url: window.location.href,
    page_section: section,
    device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    browser: navigator.userAgent.split(' ').pop(),
    created_at: new Date().toISOString(),
  })
}

export function logChatSession(sessionId, visitorId) {
  return supabasePost('chat_sessions', {
    session_id: sessionId,
    visitor_id: visitorId,
    started_at: new Date().toISOString(),
  })
}

export function logChatMessage(sessionId, role, content, score = null, tier = null) {
  return supabasePost('chat_messages', {
    session_id: sessionId,
    role,
    content,
    qualification_score: score,
    qualification_tier: tier,
    created_at: new Date().toISOString(),
  })
}
