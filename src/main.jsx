import React from 'react'
import ReactDOM from 'react-dom/client'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import { Observer } from 'gsap/Observer'

import App from './App.jsx'
import './styles/global.css'

// Register GSAP plugins (local Club GSAP files)
gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Observer)

// Initialize Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
})

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// Expose lenis globally so page components can pause/resume it during overlays
window.__lenis = lenis

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
