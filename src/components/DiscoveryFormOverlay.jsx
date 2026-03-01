import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CONFIG } from '../config.js'
import { supabasePost } from '../utils/supabase.js'
import styles from '../styles/overlays.module.css'

const overlayVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
}

const INITIAL_FORM = { name: '', email: '', phone: '', business: '', industry: '', revenue: '', message: '' }

export default function DiscoveryFormOverlay({ onClose }) {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]       = useState(false)

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)

    try {
      await Promise.all([
        fetch('https://treymccormick.app.n8n.cloud/webhook/aivanta-discovery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }),
        supabasePost('discovery_calls', {
          ...formData,
          created_at: new Date().toISOString(),
        }),
      ])
      setSuccess(true)
    } catch {
      setSubmitting(false)
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
      aria-label="Book a Discovery Call"
    >
      <div className={`${styles.panel} ${styles.formPanel}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className={styles.headerInfo}>
              <h2>Book a Discovery Call</h2>
              <div className={styles.statusRow}>
                <span className={styles.statusText}>We'll reach out within 24 hours</span>
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close form">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              className={styles.successState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
            >
              <div className={styles.successIcon}>✓</div>
              <h3>Request Received!</h3>
              <p>We'll reach out within 24 hours to schedule your discovery call. Check your email for a confirmation.</p>
              <button className="btn-accent" onClick={onClose} style={{ marginTop: '0.5rem' }}>Close</button>
            </motion.div>
          ) : (
            <motion.div key="form" className={styles.formBody} initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="disc-name">Full Name *</label>
                    <input id="disc-name" type="text" name="name" required
                      placeholder="Mike Johnson" value={formData.name} onChange={handleChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="disc-email">Email *</label>
                    <input id="disc-email" type="email" name="email" required
                      placeholder="mike@johnsonsmotors.com" value={formData.email} onChange={handleChange} />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="disc-phone">Phone</label>
                    <input id="disc-phone" type="tel" name="phone"
                      placeholder="(813) 555-0192" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="disc-business">Shop Name *</label>
                    <input id="disc-business" type="text" name="business" required
                      placeholder="Johnson's Auto Repair" value={formData.business} onChange={handleChange} />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="disc-industry">Shop Type</label>
                    <select id="disc-industry" name="industry" value={formData.industry} onChange={handleChange}>
                      <option value="">Select your shop type</option>
                      <option value="independent-shop">Independent Auto Repair Shop</option>
                      <option value="multi-location">Multi-Location Shop Group</option>
                      <option value="dealership-service">Dealership Service Center</option>
                      <option value="specialty-performance">Specialty / Performance Shop</option>
                      <option value="tire-service">Tire &amp; Service Chain</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="disc-revenue">Annual Revenue</label>
                    <select id="disc-revenue" name="revenue" value={formData.revenue} onChange={handleChange}>
                      <option value="">Select range</option>
                      <option value="under-500k">Under $500K</option>
                      <option value="500k-1m">$500K – $1M</option>
                      <option value="1m-3m">$1M – $3M</option>
                      <option value="3m-5m">$3M – $5M</option>
                      <option value="5m-plus">$5M+</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroupFull}>
                  <div className={styles.formGroup}>
                    <label htmlFor="disc-message">What's your biggest bottleneck right now?</label>
                    <textarea id="disc-message" name="message" rows={3}
                      placeholder="e.g. Declined services never followed up on, lapsed customers not returning, advisors buried in warranty calls..."
                      value={formData.message} onChange={handleChange} />
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Sending...' : 'Book Your Discovery Call'}
                </button>
                <p className={styles.formNote}>We'll email you a confirmation within 24 hours.</p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
