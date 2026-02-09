/* ============================================
   AIVANTA Frontend — script.js
   Chat application with n8n webhook integration
   ============================================ */

// ========================================
// CONFIGURATION — Update these values
// ========================================
const CONFIG = {
  // Replace with your actual n8n webhook URL
  N8N_WEBHOOK_URL: 'https://treymccormick.app.n8n.cloud/webhook/YOUR-WEBHOOK-ID',

  // Enable console logging for development
  ENABLE_DEBUG: true,

  // Session timeout in ms (30 minutes)
  SESSION_TIMEOUT: 30 * 60 * 1000,

  // Welcome message from Alex
  WELCOME_MESSAGE:
    "Hi! I'm Alex, your AI automation assistant from AIVANTA. I help businesses save time and increase revenue through intelligent automation. What brings you here today?",

  // Max message length
  MAX_MESSAGE_LENGTH: 2000,
};
// ========================================

// ----- Application State -----
const state = {
  sessionId: generateSessionId(),
  messages: [],      // { role: 'user'|'assistant', content: string, timestamp: Date }
  isTyping: false,
  currentScreen: 'hero', // 'hero' | 'text' | 'voice'
};

// ----- DOM References -----
const dom = {
  screens: {
    hero:  document.getElementById('hero'),
    text:  document.getElementById('text-chat'),
    voice: document.getElementById('voice-chat'),
  },
  btnTextChat:  document.getElementById('btn-text-chat'),
  btnVoiceChat: document.getElementById('btn-voice-chat'),
  btnCloseText: document.getElementById('btn-close-text'),
  btnCloseVoice: document.getElementById('btn-close-voice'),
  btnClearChat: document.getElementById('btn-clear-chat'),
  btnCopyChat:  document.getElementById('btn-copy-chat'),
  chatForm:     document.getElementById('chat-form'),
  chatInput:    document.getElementById('chat-input'),
  chatMessages: document.getElementById('chat-messages'),
  typingIndicator: document.getElementById('typing-indicator'),
  sendBtn:      document.getElementById('btn-send'),
  btnMic:       document.getElementById('btn-mic'),
  voiceCanvas:  document.getElementById('voice-canvas'),
  voiceStatus:  document.getElementById('voice-status'),
  toastContainer: document.getElementById('toast-container'),
};

// ============================
// INITIALIZATION
// ============================
function init() {
  debug('AIVANTA initialized', { sessionId: state.sessionId });

  // Restore session from localStorage if available
  restoreSession();

  // Bind navigation
  dom.btnTextChat.addEventListener('click', () => openScreen('text'));
  dom.btnVoiceChat.addEventListener('click', () => openScreen('voice'));
  dom.btnCloseText.addEventListener('click', () => openScreen('hero'));
  dom.btnCloseVoice.addEventListener('click', () => openScreen('hero'));

  // Chat actions
  dom.btnClearChat.addEventListener('click', clearChat);
  dom.btnCopyChat.addEventListener('click', copyChat);

  // Chat input
  dom.chatForm.addEventListener('submit', handleSend);
  dom.chatInput.addEventListener('input', handleInputChange);
  dom.chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Form submit handles it
    }
  });

  // Voice mic toggle (placeholder)
  dom.btnMic.addEventListener('click', toggleMic);

  // Start idle voice canvas animation
  drawIdleCanvas();
}

// ============================
// SCREEN NAVIGATION
// ============================
function openScreen(name) {
  // Deactivate all screens
  Object.values(dom.screens).forEach((s) => s.classList.remove('active'));

  // Activate target
  const target = dom.screens[name];
  if (target) {
    target.classList.add('active');
    state.currentScreen = name;
  }

  // If opening text chat for the first time, show welcome message
  if (name === 'text' && state.messages.length === 0) {
    addMessage('assistant', CONFIG.WELCOME_MESSAGE);
  }

  // Focus input when opening text chat
  if (name === 'text') {
    setTimeout(() => dom.chatInput.focus(), 350);
  }
}

// ============================
// MESSAGES
// ============================
function addMessage(role, content) {
  const msg = {
    role,
    content,
    timestamp: new Date(),
  };
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
// SENDING MESSAGES
// ============================
async function handleSend(e) {
  e.preventDefault();

  const text = dom.chatInput.value.trim();
  if (!text || state.isTyping) return;

  // Add user message
  addMessage('user', text);
  dom.chatInput.value = '';
  dom.sendBtn.disabled = true;

  // Show typing indicator
  showTyping(true);

  try {
    const response = await sendToWebhook(text);
    showTyping(false);

    if (response && response.response) {
      addMessage('assistant', response.response);
    } else if (response && typeof response === 'string') {
      addMessage('assistant', response);
    } else if (response && response.output) {
      addMessage('assistant', response.output);
    } else {
      addMessage('assistant', extractResponseText(response));
    }
  } catch (err) {
    showTyping(false);
    debug('Send error:', err);
    addMessage(
      'assistant',
      "I'm having a little trouble connecting right now. Could you try sending that again?"
    );
    showToast('Connection issue. Please try again.', 'error');
  }
}

function extractResponseText(response) {
  if (!response) return "Sorry, I didn't get a response. Please try again.";
  // Try common response shapes
  if (typeof response === 'string') return response;
  if (response.text) return response.text;
  if (response.message) return response.message;
  if (response.data) return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
  return "I received your message but couldn't parse the response. Please try again.";
}

// ============================
// N8N WEBHOOK INTEGRATION
// ============================
async function sendToWebhook(userMessage) {
  const conversationHistory = state.messages.map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }));

  const payload = {
    chatInput: userMessage,
    conversationHistory,
    sessionId: state.sessionId,
  };

  debug('Sending to webhook:', payload);

  const res = await fetch(CONFIG.N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Webhook responded with status ${res.status}`);
  }

  const data = await res.json();
  debug('Webhook response:', data);
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

// ============================
// INPUT HANDLING
// ============================
function handleInputChange() {
  const hasText = dom.chatInput.value.trim().length > 0;
  dom.sendBtn.disabled = !hasText;
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
  // Re-show welcome message
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
    const data = {
      sessionId: state.sessionId,
      messages: state.messages,
      savedAt: Date.now(),
    };
    localStorage.setItem('aivanta_session', JSON.stringify(data));
  } catch (_) {
    // localStorage may be unavailable
  }
}

function restoreSession() {
  try {
    const raw = localStorage.getItem('aivanta_session');
    if (!raw) return;
    const data = JSON.parse(raw);

    // Check if session expired
    if (Date.now() - data.savedAt > CONFIG.SESSION_TIMEOUT) {
      localStorage.removeItem('aivanta_session');
      return;
    }

    // Restore state
    state.sessionId = data.sessionId;
    state.messages = data.messages.map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));

    debug('Session restored', { messageCount: state.messages.length });
  } catch (_) {
    localStorage.removeItem('aivanta_session');
  }
}

// ============================
// VOICE (placeholder)
// ============================
let micActive = false;

function toggleMic() {
  micActive = !micActive;
  dom.btnMic.classList.toggle('active', micActive);
  dom.voiceStatus.textContent = micActive ? 'Listening...' : 'Ready';

  if (micActive) {
    showToast('Voice chat coming soon! Use text chat for now.', 'success');
    // Auto-deactivate after brief demo
    setTimeout(() => {
      micActive = false;
      dom.btnMic.classList.remove('active');
      dom.voiceStatus.textContent = 'Ready';
    }, 3000);
  }
}

// Idle pulsing circle animation on voice canvas
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

    // Draw concentric pulsing rings
    for (let i = 0; i < 4; i++) {
      const phase = frame * 0.02 + i * 0.8;
      const r = 30 + i * 20 + Math.sin(phase) * 8;
      const alpha = 0.12 - i * 0.025;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(39, 174, 96, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Center circle
    const coreR = 22 + Math.sin(frame * 0.03) * 4;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(39, 174, 96, 0.15)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(39, 174, 96, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

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
