/* ============================================
   AIVANTA Frontend — script.js
   Text chat + Voice chat with n8n webhook integration
   Scroll-driven landing page with overlay modals
   ============================================ */

// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
  TEXT_WEBHOOK_URL: 'https://treymccormick.app.n8n.cloud/webhook/aivanta-chat',
  VOICE_WEBHOOK_URL: 'https://treymccormick.app.n8n.cloud/webhook/aivanta-voice',
  ENABLE_DEBUG: true,
  SESSION_TIMEOUT: 30 * 60 * 1000,
  WELCOME_MESSAGE:
    "Hi! I'm Alex, your AI automation assistant from AIVANTA. I help businesses save time and increase revenue through intelligent automation. What brings you here today?",
};

// ----- Quick Acknowledgment Phrases -----
const ACKNOWLEDGMENTS = [
  "Let me think about that...",
  "Good question, give me a moment...",
  "Hmm, let me look into that...",
  "Great question, working on it...",
  "Got it, one sec...",
  "Interesting, let me dig into that...",
  "Sure thing, let me work on that...",
];
let lastAckIndex = -1;

function getRandomAcknowledgment() {
  let idx;
  do {
    idx = Math.floor(Math.random() * ACKNOWLEDGMENTS.length);
  } while (idx === lastAckIndex && ACKNOWLEDGMENTS.length > 1);
  lastAckIndex = idx;
  return ACKNOWLEDGMENTS[idx];
}

function playProcessingChime() {
  try {
    const ctx = ensureAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523, ctx.currentTime);
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    debug('Chime error (non-critical):', e);
  }
}

// ----- Application State -----
const state = {
  sessionId: generateSessionId(),
  messages: [],
  isTyping: false,
  overlayOpen: null, // 'text' | 'voice' | null
  voice: {
    status: 'idle',
    mediaRecorder: null,
    audioChunks: [],
    stream: null,
    transcript: [],
  },
};

// ----- Audio Context -----
let audioCtx = null;

function ensureAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    debug('AudioContext created, state:', audioCtx.state);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
    debug('AudioContext resumed');
  }
  return audioCtx;
}

// ----- DOM References -----
const dom = {};

function cacheDom() {
  // Overlays
  dom.textOverlay  = document.getElementById('text-chat');
  dom.voiceOverlay = document.getElementById('voice-chat');

  // Nav buttons
  dom.navTalk      = document.getElementById('nav-talk');

  // Hero buttons
  dom.heroVoice    = document.getElementById('hero-voice');

  // Final CTA buttons
  dom.finalText    = document.getElementById('final-text');
  dom.finalVoice   = document.getElementById('final-voice');

  // Pricing CTA
  dom.pricingCta   = document.getElementById('pricing-cta');

  // Close buttons
  dom.btnCloseText  = document.getElementById('btn-close-text');
  dom.btnCloseVoice = document.getElementById('btn-close-voice');

  // Chat
  dom.btnClearChat  = document.getElementById('btn-clear-chat');
  dom.btnCopyChat   = document.getElementById('btn-copy-chat');
  dom.chatForm      = document.getElementById('chat-form');
  dom.chatInput     = document.getElementById('chat-input');
  dom.chatMessages  = document.getElementById('chat-messages');
  dom.typingIndicator = document.getElementById('typing-indicator');
  dom.sendBtn       = document.getElementById('btn-send');

  // Voice
  dom.btnMic        = document.getElementById('btn-mic');
  dom.micHint       = document.getElementById('mic-hint');
  dom.voiceCanvas   = document.getElementById('voice-canvas');
  dom.voiceStatus   = document.getElementById('voice-status');
  dom.voiceTranscript = document.getElementById('voice-transcript-messages');
  dom.voicePlaceholder = document.getElementById('voice-placeholder');

  // Toast
  dom.toastContainer = document.getElementById('toast-container');

  // Nav
  dom.nav = document.getElementById('main-nav');

  // Hero particles
  dom.heroParticles = document.getElementById('hero-particles');
}

// ============================
// INITIALIZATION
// ============================
function init() {
  cacheDom();
  debug('AIVANTA initialized', { sessionId: state.sessionId });

  restoreSession();

  // Navigation — open overlays
  dom.navTalk.addEventListener('click', () => openOverlay('text'));
  dom.heroVoice.addEventListener('click', () => openOverlay('voice'));

  if (dom.finalText)  dom.finalText.addEventListener('click', () => openOverlay('text'));
  if (dom.finalVoice) dom.finalVoice.addEventListener('click', () => openOverlay('voice'));
  if (dom.pricingCta) dom.pricingCta.addEventListener('click', () => openOverlay('text'));

  // Close overlays
  dom.btnCloseText.addEventListener('click', () => closeOverlay());
  dom.btnCloseVoice.addEventListener('click', closeVoice);

  // Click backdrop to close
  dom.textOverlay.querySelector('.overlay-backdrop').addEventListener('click', () => closeOverlay());
  dom.voiceOverlay.querySelector('.overlay-backdrop').addEventListener('click', closeVoice);

  // Text chat
  dom.btnClearChat.addEventListener('click', clearChat);
  dom.btnCopyChat.addEventListener('click', copyChat);
  dom.chatForm.addEventListener('submit', handleSend);
  dom.chatInput.addEventListener('input', handleInputChange);

  // Voice chat
  dom.btnMic.addEventListener('click', handleMicClick);

  // Close overlays on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.overlayOpen) {
      if (state.overlayOpen === 'voice') {
        closeVoice();
      } else {
        closeOverlay();
      }
    }
  });

  // Scroll animations
  initScrollAnimations();
  initNavScroll();
  initHeroParticles();
  initLazyVideos();
  initParallax();
  drawIdleCanvas();
}

// ============================
// OVERLAY NAVIGATION (replaces screen navigation)
// ============================
function openOverlay(type) {
  if (type === 'text') {
    dom.textOverlay.classList.add('active');
    state.overlayOpen = 'text';
    document.body.style.overflow = 'hidden';

    if (state.messages.length === 0) {
      addMessage('assistant', CONFIG.WELCOME_MESSAGE);
    }
    if (state.messages.length > 0 && dom.chatMessages.children.length === 0) {
      renderAllMessages();
    }
    setTimeout(() => dom.chatInput.focus(), 350);
  }

  if (type === 'voice') {
    dom.voiceOverlay.classList.add('active');
    state.overlayOpen = 'voice';
    document.body.style.overflow = 'hidden';
    ensureAudioContext();

    if (state.voice.transcript.length === 0) {
      fetchVoiceGreeting();
    }
  }
}

function closeOverlay() {
  dom.textOverlay.classList.remove('active');
  dom.voiceOverlay.classList.remove('active');
  state.overlayOpen = null;
  document.body.style.overflow = '';
}

function closeVoice() {
  if (state.voice.status === 'recording' && state.voice.mediaRecorder) {
    state.voice.mediaRecorder.stop();
  }
  if (state.voice.stream) {
    state.voice.stream.getTracks().forEach((t) => t.stop());
    state.voice.stream = null;
  }
  setVoiceStatus('idle');
  closeOverlay();
}

// ============================
// SCROLL ANIMATIONS (IntersectionObserver)
// ============================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.anim-fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));

  // Stat counter animation
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach((el) => statObserver.observe(el));
  }
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current.toLocaleString();
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

// ============================
// NAV SCROLL EFFECT
// ============================
function initNavScroll() {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        dom.nav.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ============================
// HERO PARTICLES (Canvas)
// ============================
function initHeroParticles() {
  const canvas = dom.heroParticles;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  let animId;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((w * h) / 12000), 80);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.3 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Draw particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 180, 216, ${p.a})`;
      ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 180, 216, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

// ============================
// PARALLAX SCROLL (cinematic images)
// ============================
function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const imgs = document.querySelectorAll('.parallax-img');
  if (!imgs.length) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const winH = window.innerHeight;

    imgs.forEach((img) => {
      const parent = img.closest('.cinematic-break, .results-bg, .process-bg');
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      // Only apply when visible
      if (rect.bottom < 0 || rect.top > winH) return;

      // Parallax factor: image moves slower than scroll
      const progress = (rect.top + rect.height / 2) / (winH + rect.height);
      const offset = (progress - 0.5) * -60; // +-30px shift

      img.style.transform = `translateY(${offset}px) scale(1.08)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  // Initial pass
  updateParallax();
}

// ============================
// LAZY VIDEO LOADING
// ============================
function initLazyVideos() {
  const videos = document.querySelectorAll('video[preload="none"]');
  if (!videos.length) return;

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    videos.forEach((v) => v.remove());
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target;
          video.preload = 'auto';
          video.load();
          video.play().catch(() => {});
          observer.unobserve(video);
        }
      });
    },
    { rootMargin: '200px 0px' }
  );

  videos.forEach((v) => observer.observe(v));
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

async function fetchVoiceGreeting() {
  setVoiceStatus('processing');
  dom.btnMic.disabled = true;

  try {
    debug('Voice greeting → requesting');

    const res = await fetch(CONFIG.VOICE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Id': state.sessionId,
      },
      body: JSON.stringify({
        action: 'greeting',
        sessionId: state.sessionId,
      }),
    });

    if (!res.ok) throw new Error(`Greeting webhook status ${res.status}`);

    const contentType = res.headers.get('content-type') || '';
    debug('Greeting response content-type:', contentType);

    const transcript = decodeURIComponent(res.headers.get('x-transcript') || '');

    if (contentType.includes('audio')) {
      const audioArrayBuffer = await res.arrayBuffer();
      const audioResponseBlob = new Blob([audioArrayBuffer], { type: 'audio/mpeg' });
      addVoiceTranscript('alex', transcript || 'Hi, welcome to AIVANTA!');
      await playAudio(audioResponseBlob);
    } else {
      const data = await res.json();
      const text = transcript || data.response || data.output || data.text ||
        "Hi, I'm Alex from AIVANTA. How can I help you today?";
      addVoiceTranscript('alex', text);
    }

    setVoiceStatus('idle');
  } catch (err) {
    debug('Greeting error:', err);
    setVoiceStatus('idle');
  } finally {
    dom.btnMic.disabled = false;
  }
}

async function handleMicClick() {
  ensureAudioContext();
  const v = state.voice;

  if (v.status === 'processing' || v.status === 'speaking') return;

  if (v.status === 'recording') {
    stopRecording();
    return;
  }

  try {
    await startRecording();
  } catch (err) {
    debug('Mic error:', err);
    showToast('Could not access microphone. Please allow mic permission.', 'error');
  }
}

async function startRecording() {
  const v = state.voice;

  if (!v.stream) {
    v.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  }

  v.audioChunks = [];

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
  addVoiceTranscript('you', '(sent voice message)');

  const ack = getRandomAcknowledgment();
  addVoiceTranscript('alex', ack);
  playProcessingChime();

  try {
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

    const contentType = res.headers.get('content-type') || '';
    debug('Voice response content-type:', contentType);

    const transcript = decodeURIComponent(res.headers.get('x-transcript') || '');

    removeLastAlexTranscript();

    if (contentType.includes('audio')) {
      const audioArrayBuffer = await res.arrayBuffer();
      const audioResponseBlob = new Blob([audioArrayBuffer], { type: 'audio/mpeg' });
      addVoiceTranscript('alex', transcript || '(audio response)');
      await playAudio(audioResponseBlob);
    } else {
      const data = await res.json();
      const text = transcript || data.response || data.output || data.text || 'Got a response';
      addVoiceTranscript('alex', text);
    }

    setVoiceStatus('idle');
  } catch (err) {
    debug('Voice send error:', err);
    removeLastAlexTranscript();
    setVoiceStatus('idle');
    showToast('Voice connection issue. Please try again.', 'error');
  }
}

function playAudio(blob) {
  return new Promise(async (resolve, reject) => {
    try {
      const ctx = ensureAudioContext();
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      setVoiceStatus('speaking');

      source.onended = () => {
        setVoiceStatus('idle');
        resolve();
      };

      source.start(0);
      debug('Audio playing via AudioContext, duration:', audioBuffer.duration.toFixed(1) + 's');
    } catch (e) {
      debug('Audio playback error:', e);
      setVoiceStatus('idle');
      showToast('Could not play audio response.', 'error');
      reject(e);
    }
  });
}

// ============================
// VOICE — STATUS & TRANSCRIPT
// ============================
function setVoiceStatus(status) {
  state.voice.status = status;
  const btn = dom.btnMic;
  const hint = dom.micHint;

  btn.classList.remove('recording', 'processing', 'speaking');

  switch (status) {
    case 'recording':
      btn.classList.add('recording');
      dom.voiceStatus.textContent = 'Listening...';
      hint.textContent = 'Tap to stop and send';
      break;
    case 'processing':
      btn.classList.add('processing');
      dom.voiceStatus.textContent = 'Alex is thinking...';
      hint.textContent = 'Working on your response';
      break;
    case 'speaking':
      btn.classList.add('speaking');
      dom.voiceStatus.textContent = 'Alex is speaking';
      hint.textContent = '';
      break;
    default:
      dom.voiceStatus.textContent = 'Tap the mic to speak';
      hint.textContent = 'Tap to start recording';
      break;
  }
}

function removeLastAlexTranscript() {
  for (let i = state.voice.transcript.length - 1; i >= 0; i--) {
    if (state.voice.transcript[i].role === 'alex') {
      state.voice.transcript.splice(i, 1);
      break;
    }
  }
  const entries = dom.voiceTranscript.querySelectorAll('.voice-entry.alex');
  if (entries.length > 0) {
    entries[entries.length - 1].remove();
  }
}

function addVoiceTranscript(role, text) {
  state.voice.transcript.push({ role, text });

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

    // Cyan accent color
    let r = 0, g = 180, b = 216;
    if (isRecording) { r = 231; g = 76; b = 60; }
    if (isProcessing) { r = 0; g = 180; b = 216; }
    if (isSpeaking) { r = 0; g = 214; b = 143; }

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

    const coreR = 22 + Math.sin(frame * (speed * 1.5)) * (amplitude * 0.5);
    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.15)`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.35)`;
    ctx.lineWidth = 2;
    ctx.stroke();

    if (isProcessing) {
      for (let i = 0; i < 3; i++) {
        const angle = (frame * 0.05) + (i * Math.PI * 2 / 3);
        const dx = cx + Math.cos(angle) * 45;
        const dy = cy + Math.sin(angle) * 45;
        ctx.beginPath();
        ctx.arc(dx, dy, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 180, 216, ${0.4 + Math.sin(frame * 0.1 + i) * 0.3})`;
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
