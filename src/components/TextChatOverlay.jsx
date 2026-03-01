import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { CONFIG, ACKNOWLEDGMENTS } from '../config.js'
import { generateSessionId, saveSession, restoreSession } from '../utils/session.js'
import { supabasePost, logChatSession, logChatMessage } from '../utils/supabase.js'
import styles from '../styles/overlays.module.css'

const overlayVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
}

let lastAckIdx = -1
function getRandomAck() {
  let idx
  do { idx = Math.floor(Math.random() * ACKNOWLEDGMENTS.length) }
  while (idx === lastAckIdx && ACKNOWLEDGMENTS.length > 1)
  lastAckIdx = idx
  return ACKNOWLEDGMENTS[idx]
}

export default function TextChatOverlay({ onClose }) {
  const [sessionId]        = useState(() => {
    const restored = restoreSession()
    return restored ? restored.sessionId : generateSessionId()
  })
  const [messages, setMessages] = useState(() => {
    const restored = restoreSession()
    if (restored && restored.messages.length) return restored.messages
    return [{ role: 'alex', text: CONFIG.WELCOME_MESSAGE, id: Date.now() }]
  })
  const [input, setInput]       = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef           = useRef(null)
  const inputRef                 = useRef(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus()
    logChatSession(sessionId, sessionId)
  }, [sessionId])

  // Save session whenever messages change
  useEffect(() => {
    saveSession(sessionId, messages)
  }, [sessionId, messages])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const addMessage = useCallback((role, text) => {
    const msg = { role, text, id: Date.now() + Math.random() }
    setMessages(prev => [...prev, msg])
    return msg
  }, [])

  async function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isTyping) return

    setInput('')
    addMessage('user', text)
    logChatMessage(sessionId, 'user', text)

    setIsTyping(true)

    try {
      const res = await fetch(CONFIG.TEXT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId }),
      })
      const data = await res.json()
      const reply = data.response || data.output || data.text || data.message || "I'm working on a response — try again in a moment."
      addMessage('alex', reply)
      logChatMessage(sessionId, 'assistant', reply, data.score ?? null, data.qualificationTier ?? null)
    } catch {
      addMessage('alex', "Apologies — I'm having trouble connecting right now. Please try again.")
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <motion.div
      className={styles.backdrop}
      variants={overlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      aria-modal="true"
      role="dialog"
      aria-label="Chat with Alex"
    >
      <div className={styles.panel}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>A</div>
            <div className={styles.headerInfo}>
              <h2>Alex</h2>
              <div className={styles.statusRow}>
                <span className={styles.statusDot} />
                <span className={styles.statusText}>AIVANTA Shop Advisor</span>
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className={styles.messages} role="log" aria-live="polite">
          {messages.map(msg => (
            <div key={msg.id} className={`${styles.msg} ${msg.role === 'user' ? styles.msgUser : styles.msgAlex}`}>
              <span className={styles.msgRole}>{msg.role === 'user' ? 'You' : 'Alex'}</span>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className={styles.typing}>
              <div className={styles.avatar} style={{ width: 24, height: 24, fontSize: '0.7rem' }}>A</div>
              <div className={styles.typingDots}>
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form className={styles.inputArea} onSubmit={handleSend} autoComplete="off">
          <label htmlFor="chat-input" className="sr-only">Type your message</label>
          <input
            id="chat-input"
            ref={inputRef}
            className={styles.chatInput}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about declined services, lapsed customers, warranty prep..."
            maxLength={2000}
            disabled={isTyping}
          />
          <button
            type="submit"
            className={styles.sendBtn}
            aria-label="Send message"
            disabled={!input.trim() || isTyping}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
      </div>
    </motion.div>
  )
}
