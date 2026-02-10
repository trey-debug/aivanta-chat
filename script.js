/* ============================================
   AIVANTA Frontend — script.js
   Text chat + Voice chat with n8n webhook integration
   ============================================ */

// ========================================
// CONFIGURATION — Update these values
// ========================================
const CONFIG = {
  // Text chat webhook (POST JSON, returns JSON)
  TEXT_WEBHOOK_URL: 'https://treymccormick.app.n8n.cloud/webhook/aivanta-chat',

  // Voice chat webhook (POST audio blob, returns audio/mpeg)
  VOICE_WEBHOOK_URL: 'https://treymccormick.app.n8n.cloud/webhook/aivanta-voice',

  // Enable console logging for development
  ENABLE_DEBUG: true,

  // Session timeout in ms (30 minutes)
  SESSION_TIMEOUT: 30 * 60 * 1000,

  // Welcome message from Alex (text chat)
  WELCOME_MESSAGE:
    "Hi! I'm Alex, your AI automation assistant from AIVANTA. I help businesses save time and increase revenue through intelligent automation. What brings you here today?",
};
// ========================================

// ----- Application State -----
const state = {
  sessionId: generateSessionId(),
  messages: [],       // text chat: { role, content, timestamp }
  isTyping: false,
  currentScreen: 'hero',
  voice: {
    status: 'idle',   // idle | recording | processing | speaking
    mediaRecorder: null,
    audioChunks: [],
    stream: null,
    transcript: [],    // { role: 'you'|'alex', text: string }
  },
};

// ----- DOM References -----
const dom = {};

function cacheDom() {
  dom.screens = {
    hero:  document.getElementById('hero'),
    text:  document.getElementById('text-chat'),
    voice: document.getElementById('voice-chat'),
  };
  dom.btnTextChat   = document.getElementById('btn-text-chat');
  dom.btnVoiceChat  = document.getElementById('btn-voice-chat');
  dom.btnCloseText  = document.getElementById('btn-close-text');
  dom.btnCloseVoice = document.getElementById('btn-close-voice');
  dom.btnClearChat  = document.getElementById('btn-clear-chat');
  dom.btnCopyChat   = document.getElementById('btn-copy-chat');
  dom.chatForm      = document.getElementById('chat-form');
  dom.chatInput     = document.getElementById('chat-input');
  dom.chatMessages  = document.getElementById('chat-messages');
  dom.typingIndicator = document.getElementById('typing-indicator');
  dom.sendBtn       = document.getElementById('btn-send');
  dom.btnMic        = document.getElementById('btn-mic');
  dom.micHint       = document.getElementById('mic-hint');
  dom.voiceCanvas   = document.getElementById('voice-canvas');
  dom.voiceStatus   = document.getElementById('voice-status');
  dom.voiceTranscript = document.getElementById('voice-transcript-messages');
  dom.voicePlaceholder = document.getElementById('voice-placeholder');
  dom.toastContainer = document.getElementById('toast-container');
}

// ============================
// INITIALIZATION
// ============================
function init() {
  cacheDom();
  debug('AIVANTA initialized', { sessionId: state.sessionId });

  restoreSession();

  // Navigation
  dom.btnTextChat.addEventListener('click', () => openScreen('text'));
  dom.btnVoiceChat.addEventListener('click', () => openScreen('voice'));
  dom.btnCloseText.addEventListener('click', () => openScreen('hero'));
  dom.btnCloseVoice.addEventListener('click', closeVoice);

  // Text chat
  dom.btnClearChat.addEventListener('click', clearChat);
  dom.btnCopyChat.addEventListener('click', copyChat);
  dom.chatForm.addEventListener('submit', handleSend);
  dom.chatInput.addEventListener('input', handleInputChange);

  // Voice chat — tap to start/stop recording
  dom.btnMic.addEventListener('click', handleMicClick);

  // Start idle canvas animation
  drawIdleCanvas();
}

// ============================
// SCREEN NAVIGATION
// ============================
function openScreen(name) {
  Object.values(dom.screens).forEach((s) => s.classList.remove('active'));

  const target = dom.screens[name];
  if (target) {
    target.classList.add('active');
    state.currentScreen = name;
  }

  if (name === 'text' && state.messages.length === 0) {
    addMessage('assistant', CONFIG.WELCOME_MESSAGE);
  }

  if (name === 'text') {
    setTimeout(() => dom.chatInput.focus(), 350);
  }

  // Render restored messages when opening text chat
  if (name === 'text' && state.messages.length > 0 && dom.chatMessages.children.length === 0) {
    renderAllMessages();
  }
}

function closeVoice() {
  // Stop any recording in progress
  if (state.voice.status === 'recording' && state.voice.mediaRecorder) {
    state.voice.mediaRecorder.stop();
  }
  // Release mic stream
  if (state.voice.stream) {
    state.voice.stream.getTracks().forEach((t) => t.stop());
    state.voice.stream = null;
  }
  setVoiceStatus('idle');
  openScreen('hero');
}

// ============================
// TEXT CHAT — MESSAGES
// ============================
function addMessage(role, content) {
  const msg = { role, content, timestamp: new Date() };
  state.messages.push(msg);
  renderMessage(msg);
  scrollToBottom();
  saveSession();
}

function renderMessage(msg) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('message', msg.role === 'assistant' ? 'ai' : 'user');

  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble');
  bubble.textContent = msg.content;

  const time = document.createElement('span');
  time.classList.add('message-time');
  time.textContent = formatTime(msg.timestamp);

  wrapper.appendChild(bubble);
  wrapper.appendChild(time);
  dom.chatMessages.appendChild(wrapper);
}

function renderAllMessages() {
  dom.chatMessages.innerHTML = '';
  state.messages.forEach((m) => renderMessage(m));
  scrollToBottom();
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
  });
}

// ============================
// TEXT CHAT — SEND
// ============================
async function handleSend(e) {
  e.preventDefault();
  const text = dom.chatInput.value.trim();
  if (!text || state.isTyping) return;

  addMessage('user', text);
  dom.chatInput.value = '';
  dom.sendBtn.disabled = true;
  showTyping(true);

  try {
    const data = await sendTextWebhook(text);
    showTyping(false);

    const reply = data.response || data.output || data.text || data.message ||
      (typeof data === 'string' ? data : null) ||
      "Sorry, I didn't get a response. Please try again.";
    addMessage('assistant', reply);
  } catch (err) {
    showTyping(false);
    debug('Text send error:', err);
    addMessage('assistant', "I'm having a little trouble connecting right now. Could you try sending that again?");
    showToast('Connection issue. Please try again.', 'error');
  }
}

// ============================
// TEXT CHAT — WEBHOOK
// ============================
async function sendTextWebhook(userMessage) {
  const payload = {
    message: userMessage,
    sessionId: state.sessionId,
  };

  debug('Text webhook →', payload);

  const res = await fetch(CONFIG.TEXT_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Text webhook status ${res.status}`);

  const data = await res.json();
  debug('Text webhook ←', data);
  return data;
}

// ============================
// TYPING INDICATOR
// ============================
function showTyping(show) {
  state.isTyping = show;
  dom.typingIndicator.classList.toggle('hidden', !show);
  if (show) scrollToBottom();
}

function handleInputChange() {
  dom.sendBtn.disabled = !dom.chatInput.value.trim();
}

// ============================
// CLEAR & COPY
// ============================
function clearChat() {
  if (state.messages.length === 0) return;
  state.messages = [];
  dom.chatMessages.innerHTML = '';
  localStorage.removeItem('aivanta_session');
  state.sessionId = generateSessionId();
  addMessage('assistant', CONFIG.WELCOME_MESSAGE);
  showToast('Conversation cleared', 'success');
}

function copyChat() {
  if (state.messages.length === 0) return;
  const text = state.messages
    .map((m) => `${m.role === 'assistant' ? 'Alex' : 'You'}: ${m.content}`)
    .join('\n\n');
  navigator.clipboard.writeText(text).then(
    () => showToast('Conversation copied!', 'success'),
    () => showToast('Could not copy', 'error')
  );
}

// ============================
// SESSION PERSISTENCE
// ============================
function saveSession() {
  try {
    localStorage.setItem('aivanta_session', JSON.stringify({
      sessionId: state.sessionId,
      messages: state.messages,
      savedAt: Date.now(),
    }));
  } catch (_) { /* localStorage unavailable */ }
}

function restoreSession() {
  try {
    const raw = localStorage.getItem('aivanta_session');
    if (!raw) return;
    const data = JSON.parse(raw);
    if (Date.now() - data.savedAt > CONFIG.SESSION_TIMEOUT) {
      localStorage.removeItem('aivanta_session');
      return;
    }
    state.sessionId = data.sessionId;
    state.messages = data.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
    debug('Session restored', { messageCount: state.messages.length });
  } catch (_) {
    localStorage.removeItem('aivanta_session');
  }
}

// ============================
// VOICE CHAT
// ============================

async function handleMicClick() {
  const v = state.voice;

  if (v.status === 'processing' || v.status === 'speaking') {
    // Busy — ignore clicks
    return;
  }

  if (v.status === 'recording') {
    // Stop recording & send
    stopRecording();
    return;
  }

  // Start recording
  try {
    await startRecording();
  } catch (err) {
    debug('Mic error:', err);
    showToast('Could not access microphone. Please allow mic permission.', 'error');
  }
}

async function startRecording() {
  const v = state.voice;

  // Request mic access if we don't already have a stream
  if (!v.stream) {
    v.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  }

  v.audioChunks = [];

  // Use webm if supported (ElevenLabs STT handles it), fallback to whatever is available
  const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
    ? 'audio/webm;codecs=opus'
    : MediaRecorder.isTypeSupported('audio/webm')
      ? 'audio/webm'
      : '';

  v.mediaRecorder = mimeType
    ? new MediaRecorder(v.stream, { mimeType })
    : new MediaRecorder(v.stream);

  v.mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) v.audioChunks.push(e.data);
  };

  v.mediaRecorder.onstop = () => {
    const blob = new Blob(v.audioChunks, { type: v.mediaRecorder.mimeType || 'audio/webm' });
    debug('Recording stopped, blob size:', blob.size);
    sendVoiceMessage(blob);
  };

  v.mediaRecorder.start();
  setVoiceStatus('recording');
  debug('Recording started');
}

function stopRecording() {
  const v = state.voice;
  if (v.mediaRecorder && v.mediaRecorder.state === 'recording') {
    v.mediaRecorder.stop();
  }
}

async function sendVoiceMessage(audioBlob) {
  setVoiceStatus('processing');

  try {
    // Build form data with audio and session metadata
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('sessionId', state.sessionId);

    debug('Voice webhook → sending audio', { size: audioBlob.size });

    const res = await fetch(CONFIG.VOICE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'X-Session-Id': state.sessionId,
      },
      body: formData,
    });

    if (!res.ok) throw new Error(`Voice webhook status ${res.status}`);

    // Response is audio/mpeg binary
    const contentType = res.headers.get('content-type') || '';
    debug('Voice response content-type:', contentType);

    if (contentType.includes('audio')) {
      const audioArrayBuffer = await res.arrayBuffer();
      const audioResponseBlob = new Blob([audioArrayBuffer], { type: 'audio/mpeg' });

      // Add transcript entry for Alex (we don't get text back, so note it)
      addVoiceTranscript('alex', '(audio response)');

      // Play the audio response
      await playAudio(audioResponseBlob);
    } else {
      // Fallback: maybe it returned JSON with text
      const data = await res.json();
      const text = data.response || data.output || data.text || 'Got a response';
      addVoiceTranscript('alex', text);
    }

    setVoiceStatus('idle');
  } catch (err) {
    debug('Voice send error:', err);
    setVoiceStatus('idle');
    showToast('Voice connection issue. Please try again.', 'error');
  }
}

function playAudio(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    setVoiceStatus('speaking');

    audio.onended = () => {
      URL.revokeObjectURL(url);
      setVoiceStatus('idle');
      resolve();
    };
    audio.onerror = (e) => {
      URL.revokeObjectURL(url);
      setVoiceStatus('idle');
      debug('Audio playback error:', e);
      reject(e);
    };

    audio.play().catch((e) => {
      URL.revokeObjectURL(url);
      setVoiceStatus('idle');
      debug('Audio play() failed:', e);
      showToast('Could not play audio response.', 'error');
      reject(e);
    });
  });
}

// ============================
// VOICE — STATUS & TRANSCRIPT
// ============================
function setVoiceStatus(status) {
  state.voice.status = status;
  const btn = dom.btnMic;
  const hint = dom.micHint;

  // Remove all state classes
  btn.classList.remove('recording', 'processing', 'speaking');

  switch (status) {
    case 'recording':
      btn.classList.add('recording');
      dom.voiceStatus.textContent = 'Listening...';
      hint.textContent = 'Tap to stop and send';
      break;
    case 'processing':
      btn.classList.add('processing');
      dom.voiceStatus.textContent = 'Thinking...';
      hint.textContent = 'Processing your message';
      break;
    case 'speaking':
      btn.classList.add('speaking');
      dom.voiceStatus.textContent = 'Alex is speaking';
      hint.textContent = '';
      break;
    default: // idle
      dom.voiceStatus.textContent = 'Tap the mic to speak';
      hint.textContent = 'Tap to start recording';
      break;
  }
}

function addVoiceTranscript(role, text) {
  state.voice.transcript.push({ role, text });

  // Hide placeholder
  if (dom.voicePlaceholder) dom.voicePlaceholder.style.display = 'none';

  const entry = document.createElement('div');
  entry.classList.add('voice-entry', role === 'alex' ? 'alex' : 'you');

  const label = document.createElement('div');
  label.classList.add('voice-label');
  label.textContent = role === 'alex' ? 'Alex' : 'You';

  const content = document.createElement('div');
  content.classList.add('voice-text');
  content.textContent = text;

  entry.appendChild(label);
  entry.appendChild(content);
  dom.voiceTranscript.appendChild(entry);

  // Scroll transcript
  dom.voiceTranscript.scrollTop = dom.voiceTranscript.scrollHeight;
}

// ============================
// VOICE — CANVAS ANIMATION
// ============================
function drawIdleCanvas() {
  const canvas = dom.voiceCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, w, h);

    const v = state.voice.status;
    const isRecording = v === 'recording';
    const isSpeaking = v === 'speaking';
    const isProcessing = v === 'processing';

    // Ring color based on state
    let r = 39, g = 174, b = 96; // green
    if (isRecording) { r = 231; g = 76; b = 60; } // red
    if (isProcessing) { r = 52; g = 152; b = 219; } // blue

    // Ring intensity
    const intensity = (isRecording || isSpeaking) ? 0.3 : 0.12;
    const speed = (isRecording || isSpeaking) ? 0.06 : 0.02;
    const amplitude = (isRecording || isSpeaking) ? 14 : 8;

    for (let i = 0; i < 4; i++) {
      const phase = frame * speed + i * 0.8;
      const radius = 30 + i * 20 + Math.sin(phase) * amplitude;
      const alpha = intensity - i * 0.04;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0.02, alpha)})`;
      ctx.lineWidth = isRecording ? 3 : 2;
      ctx.stroke();
    }

    // Center circle
    const coreR = 22 + Math.sin(frame * (speed * 1.5)) * (amplitude * 0.5);
    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.15)`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.35)`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Processing spinner dots
    if (isProcessing) {
      for (let i = 0; i < 3; i++) {
        const angle = (frame * 0.05) + (i * Math.PI * 2 / 3);
        const dx = cx + Math.cos(angle) * 45;
        const dy = cy + Math.sin(angle) * 45;
        ctx.beginPath();
        ctx.arc(dx, dy, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 152, 219, ${0.4 + Math.sin(frame * 0.1 + i) * 0.3})`;
        ctx.fill();
      }
    }

    frame++;
    requestAnimationFrame(draw);
  }

  draw();
}

// ============================
// TOAST NOTIFICATIONS
// ============================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.classList.add('toast', type);
  toast.textContent = message;
  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    toast.addEventListener('animationend', () => toast.remove());
  }, 2500);
}

// ============================
// UTILITIES
// ============================
function generateSessionId() {
  return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

function formatTime(date) {
  if (!(date instanceof Date)) date = new Date(date);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function debug(...args) {
  if (CONFIG.ENABLE_DEBUG) console.log('[AIVANTA]', ...args);
}

// ============================
// START
// ============================
document.addEventListener('DOMContentLoaded', init);
