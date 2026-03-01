import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import TextChatOverlay from './components/TextChatOverlay.jsx'
import VoiceChatOverlay from './components/VoiceChatOverlay.jsx'
import DiscoveryFormOverlay from './components/DiscoveryFormOverlay.jsx'

import Home     from './pages/Home.jsx'
import About    from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Process  from './pages/Process.jsx'
import Pricing  from './pages/Pricing.jsx'
import Contact  from './pages/Contact.jsx'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

function PageMotion({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}

function AnimatedRoutes({ setOverlayOpen }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageMotion><Home setOverlayOpen={setOverlayOpen} /></PageMotion>
        } />
        <Route path="/about" element={
          <PageMotion><About setOverlayOpen={setOverlayOpen} /></PageMotion>
        } />
        <Route path="/services" element={
          <PageMotion><Services setOverlayOpen={setOverlayOpen} /></PageMotion>
        } />
        <Route path="/process" element={
          <PageMotion><Process setOverlayOpen={setOverlayOpen} /></PageMotion>
        } />
        <Route path="/pricing" element={
          <PageMotion><Pricing setOverlayOpen={setOverlayOpen} /></PageMotion>
        } />
        <Route path="/contact" element={
          <PageMotion><Contact /></PageMotion>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function AppInner() {
  // 'text' | 'voice' | 'discovery' | null
  const [overlayOpen, setOverlayOpen] = useState(null)

  const closeOverlay = useCallback(() => {
    setOverlayOpen(null)
    // Resume Lenis scroll when overlay closes
    if (window.__lenis) window.__lenis.start()
  }, [])

  const openOverlay = useCallback((type) => {
    setOverlayOpen(type)
    // Pause Lenis scroll while overlay is open
    if (window.__lenis) window.__lenis.stop()
  }, [])

  return (
    <>
      <Nav setOverlayOpen={openOverlay} />

      <main>
        <AnimatedRoutes setOverlayOpen={openOverlay} />
      </main>

      <Footer setOverlayOpen={openOverlay} />

      <AnimatePresence>
        {overlayOpen === 'text' && (
          <TextChatOverlay key="text" onClose={closeOverlay} />
        )}
        {overlayOpen === 'voice' && (
          <VoiceChatOverlay key="voice" onClose={closeOverlay} />
        )}
        {overlayOpen === 'discovery' && (
          <DiscoveryFormOverlay key="discovery" onClose={closeOverlay} />
        )}
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
