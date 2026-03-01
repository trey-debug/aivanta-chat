import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { CONFIG } from '../config.js'
import { generateSessionId, restoreSession } from '../utils/session.js'
import styles from '../styles/overlays.module.css'

const overlayVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
}

// Voice status colors
const STATUS_COLORS = {
  idle:       { r: 255, g: 255, b: 255, alpha: 0.15 },
  recording:  { r: 224, g: 32,  b: 32,  alpha: 0.8  },
  processing: { r: 224, g: 32,  b: 32,  alpha: 0.4  },
  speaking:   { r: 46,  g: 204, b: 113, alpha: 0.8  },
}

export default function VoiceChatOverlay({ onClose }) {
  const [sessionId] = useState(() => {
    const r = restoreSession()
    return r ? r.sessionId : generateSessionId()
  })
  const [voiceStatus, setVoiceStatus]   = useState('idle')
  const [transcript, setTranscript]     = useState([])
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const audioChunksRef  = useRef([])
  const audioCtxRef     = useRef(null)
  const canvasRef        = useRef(null)
  const rafRef           = useRef(null)
  const streamRef        = useRef(null)
  const voiceStatusRef   = useRef('idle')

  // Keep ref in sync
  useEffect(() => { voiceStatusRef.current = voiceStatus }, [voiceStatus])

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    const cx = w / 2
    const cy = h / 2
    let frame = 0

    function draw() {
      ctx.clearRect(0, 0, w, h)
      const status = voiceStatusRef.current
      const { r, g, b, alpha } = STATUS_COLORS[status] || STATUS_COLORS.idle

      const speed     = status === 'recording' ? 0.08 : status === 'speaking' ? 0.06 : 0.03
      const amplitude = status === 'idle' ? 4 : 10

      for (let i = 0; i < 4; i++) {
        const phase  = frame * speed + i * 0.8
        const radius = 28 + i * 18 + Math.sin(phase) * amplitude
        const a      = (alpha - i * 0.03) * (0.6 + Math.sin(phase) * 0.4)
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r},${g},${b},${Math.max(0, a)})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Orbiting particles when processing
      if (status === 'processing') {
        for (let i = 0; i < 3; i++) {
          const angle = frame * 0.05 + (i * Math.PI * 2) / 3
          const dx = cx + Math.cos(angle) * 42
          const dy = cy + Math.sin(angle) * 42
          ctx.beginPath()
          ctx.arc(dx, dy, 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(224,32,32,${0.4 + Math.sin(frame * 0.1 + i) * 0.3})`
          ctx.fill()
        }
      }

      // Center dot
      ctx.beginPath()
      ctx.arc(cx, cy, 6, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
      ctx.fill()

      frame++
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  function ensureAudioContext() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }

  function playProcessingChime() {
    try {
      const ctx  = ensureAudioContext()
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(523, ctx.currentTime)
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.4)
    } catch (_) {}
  }

  const playAudio = useCallback((blob) => {
    return new Promise(async (resolve) => {
      try {
        const ctx = ensureAudioContext()
        const arrayBuffer = await blob.arrayBuffer()
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
        const source = ctx.createBufferSource()
        source.buffer = audioBuffer
        source.connect(ctx.destination)
        setVoiceStatus('speaking')
        source.onended = () => {
          setVoiceStatus('idle')
          resolve()
        }
        source.start(0)
      } catch {
        setVoiceStatus('idle')
        resolve()
      }
    })
  }, [])

  function addTranscript(role, text) {
    setTranscript(prev => [...prev, { role, text, id: Date.now() + Math.random() }])
  }

  function removeLastAlexEntry() {
    setTranscript(prev => {
      const copy = [...prev]
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === 'alex') { copy.splice(i, 1); break }
      }
      return copy
    })
  }

  // Fetch greeting on open
  useEffect(() => {
    async function fetchGreeting() {
      try {
        const res = await fetch(CONFIG.VOICE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Session-Id': sessionId },
          body: JSON.stringify({ action: 'greeting', sessionId }),
        })
        const contentType = res.headers.get('content-type') || ''
        const xTranscript = decodeURIComponent(res.headers.get('x-transcript') || '')

        if (contentType.includes('audio')) {
          const blob = new Blob([await res.arrayBuffer()], { type: 'audio/mpeg' })
          addTranscript('alex', xTranscript || "Hi! I'm Alex from AIVANTA — happy to chat about your shop.")
          await playAudio(blob)
        } else {
          const data = await res.json().catch(() => ({}))
          addTranscript('alex', xTranscript || data.response || "Hi! I'm Alex — what can I help you with?")
        }
      } catch {
        addTranscript('alex', "Hi! I'm Alex from AIVANTA. Tap the mic to get started.")
      }
    }
    fetchGreeting()
    return () => {
      // Cleanup: stop any active recording stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [sessionId, playAudio])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  async function sendVoiceMessage(blob) {
    setVoiceStatus('processing')
    addTranscript('you', '(sent voice message)')
    const ack = 'Processing...'
    addTranscript('alex', ack)
    playProcessingChime()

    const formData = new FormData()
    formData.append('file', blob, 'recording.webm')
    formData.append('sessionId', sessionId)

    try {
      const res = await fetch(CONFIG.VOICE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'X-Session-Id': sessionId },
        body: formData,
      })
      removeLastAlexEntry()

      const contentType = res.headers.get('content-type') || ''
      const xTranscript = decodeURIComponent(res.headers.get('x-transcript') || '')

      if (contentType.includes('audio')) {
        const audioBlob = new Blob([await res.arrayBuffer()], { type: 'audio/mpeg' })
        addTranscript('alex', xTranscript || '(audio response)')
        await playAudio(audioBlob)
      } else {
        const data = await res.json().catch(() => ({}))
        const text = xTranscript || data.response || data.text || "I couldn't process that — please try again."
        addTranscript('alex', text)
        setVoiceStatus('idle')
      }
    } catch {
      removeLastAlexEntry()
      addTranscript('alex', "Sorry, I had trouble processing that. Please try again.")
      setVoiceStatus('idle')
    }
  }

  async function handleMicClick() {
    if (voiceStatus === 'recording' && mediaRecorder) {
      mediaRecorder.stop()
      streamRef.current?.getTracks().forEach(t => t.stop())
      return
    }
    if (voiceStatus !== 'idle') return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      audioChunksRef.current = []

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'

      const recorder = new MediaRecorder(stream, { mimeType })
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType })
        sendVoiceMessage(blob)
      }

      recorder.start()
      setMediaRecorder(recorder)
      setVoiceStatus('recording')
    } catch {
      addTranscript('alex', "Microphone access denied. Please allow mic access and try again.")
    }
  }

  const statusLabel = {
    idle:       'Tap the mic to speak',
    recording:  'Recording... tap to send',
    processing: 'Processing...',
    speaking:   'Alex is speaking...',
  }[voiceStatus]

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
      aria-label="Voice chat with Alex"
    >
      <div className={`${styles.panel} ${styles.voicePanel}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>A</div>
            <div className={styles.headerInfo}>
              <h2>Alex</h2>
              <div className={styles.statusRow}>
                <span className={styles.statusDot} />
                <span className={styles.statusText}>Voice Advisor</span>
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close voice chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Visualizer */}
        <div className={styles.visualizerWrap}>
          <canvas ref={canvasRef} className={styles.voiceCanvas} width={200} height={200} aria-hidden="true" />
          <p className={styles.voiceStatusText}>{statusLabel}</p>
        </div>

        {/* Mic button */}
        <div className={styles.voiceControls}>
          <button
            className={`${styles.micBtn} ${voiceStatus === 'recording' ? styles.recording : ''}`}
            onClick={handleMicClick}
            disabled={voiceStatus === 'processing' || voiceStatus === 'speaking'}
            aria-label={voiceStatus === 'recording' ? 'Stop recording' : 'Start recording'}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
              <path d="M19 10v2a7 7 0 01-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>
          <p className={styles.micHint}>
            {voiceStatus === 'recording' ? 'Tap to send' : 'Tap to speak'}
          </p>
        </div>

        {/* Transcript */}
        <div className={styles.voiceTranscript} aria-label="Conversation transcript">
          <h3>Transcript</h3>
          {transcript.length === 0 ? (
            <p className={styles.voicePlaceholder}>Your conversation with Alex will appear here.</p>
          ) : (
            transcript.map(msg => (
              <div key={msg.id} className={styles.transcriptMsg}>
                <span className={styles.transcriptRole}>{msg.role === 'you' ? 'You' : 'Alex'}</span>
                <span className={msg.role === 'you' ? styles.transcriptYou : styles.transcriptAlex}>
                  {msg.text}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}
