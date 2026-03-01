import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CONFIG } from '../config.js'
import { supabasePost } from '../utils/supabase.js'
import { useScrollTriggerCleanup } from '../hooks/useScrollTrigger.js'
import styles from '../styles/pages.module.css'

const INITIAL_FORM = {
  name: '', email: '', phone: '', business: '', industry: '', revenue: '', message: '',
}

export default function Contact() {
  useScrollTriggerCleanup()

  const [formData, setFormData] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]       = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 50)
    return () => clearTimeout(timer)
  }, [])

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
    <>
      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className={`container ${styles.pageHeroInner}`}>
          <span className={styles.pageEyebrow}>Let's Talk</span>
          <h1 className={styles.pageHeadline}>
            Book Your<br />
            Discovery Call.
          </h1>
          <p className={styles.pageSubhead}>We'll reach out within 24 hours.</p>
        </div>
      </section>

      {/* Contact form + info */}
      <section className={styles.pageSection}>
        <div className={styles.contactGrid}>

          {/* Left: contact info */}
          <div className={styles.contactInfo}>
            <h3>We're Here.</h3>
            <div className={styles.contactDetails}>
              <p>Palm Harbor, Florida</p>
              <p>
                <a href="mailto:hello@aivantaautomations.com">
                  hello@aivantaautomations.com
                </a>
              </p>
            </div>

            <div style={{ marginTop: '3rem' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--mid-gray)', display: 'block', marginBottom: '1rem' }}>
                What to Expect
              </span>
              {[
                'A 20-minute conversation about your shop',
                'An honest assessment of which automations fit',
                'Clear pricing — no surprises',
                'No pressure, no pushy follow-ups',
              ].map((item, i) => (
                <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 300, color: 'var(--light-gray)', lineHeight: 1.7, paddingLeft: '1.25rem', position: 'relative', marginBottom: '0.5rem' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--red)' }}>—</span>
                  {item}
                </p>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className={styles.inlineForm}>
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
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  autoComplete="off"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-name">Full Name *</label>
                      <input id="contact-name" type="text" name="name" required
                        placeholder="Mike Johnson" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-email">Email *</label>
                      <input id="contact-email" type="email" name="email" required
                        placeholder="mike@johnsonsmotors.com" value={formData.email} onChange={handleChange} />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-phone">Phone</label>
                      <input id="contact-phone" type="tel" name="phone"
                        placeholder="(813) 555-0192" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-business">Shop Name *</label>
                      <input id="contact-business" type="text" name="business" required
                        placeholder="Johnson's Auto Repair" value={formData.business} onChange={handleChange} />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-industry">Shop Type</label>
                      <select id="contact-industry" name="industry" value={formData.industry} onChange={handleChange}>
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
                      <label htmlFor="contact-revenue">Annual Revenue</label>
                      <select id="contact-revenue" name="revenue" value={formData.revenue} onChange={handleChange}>
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
                      <label htmlFor="contact-message">What's your biggest bottleneck right now?</label>
                      <textarea id="contact-message" name="message" rows={3}
                        placeholder="e.g. Declined services never followed up on, lapsed customers not returning..."
                        value={formData.message} onChange={handleChange} />
                    </div>
                  </div>

                  <button type="submit" className={styles.submitBtn} disabled={submitting}>
                    {submitting ? 'Sending...' : 'Book Your Discovery Call'}
                  </button>
                  <p className={styles.formNote}>We'll email you a confirmation within 24 hours.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>
    </>
  )
}
