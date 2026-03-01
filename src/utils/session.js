// ============================================
// Session persistence — migrated from script.js
// ============================================
import { CONFIG } from '../config.js'

const STORAGE_KEY = 'aivanta_session'

export function generateSessionId() {
  return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
}

export function saveSession(sessionId, messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      sessionId,
      messages,
      savedAt: Date.now(),
    }))
  } catch (_) {
    // Storage unavailable — degrade gracefully
  }
}

export function restoreSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (Date.now() - data.savedAt > CONFIG.SESSION_TIMEOUT) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return { sessionId: data.sessionId, messages: data.messages }
  } catch (_) {
    return null
  }
}

export function clearSession() {
  try { localStorage.removeItem(STORAGE_KEY) } catch (_) {}
}
