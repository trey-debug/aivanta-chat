import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollTriggerCleanup } from '../hooks/useScrollTrigger.js'
import styles from '../styles/pages.module.css'

const TIERS = [
  {
    name: 'Foundation',
    target: '1–3 Advisors',
    price: '$597',
    setup: '$1,500',
    features: [
      'AI Scheduling Agent',
      'Declined Service Follow-Up',
      'Monthly performance reports',
      'Email + SMS automation',
      'CRM integration',
      'Dedicated onboarding support',
    ],
    featured: false,
  },
  {
    name: 'Growth',
    target: '3–5 Advisors',
    price: '$997',
    setup: '$3,000',
    features: [
      'Everything in Foundation',
      'Customer Re-Engagement System',
      'DVI Video Summarizer',
      'Priority support',
      'Advanced analytics dashboard',
      '90-day re-engagement guarantee',
    ],
    featured: true,
  },
  {
    name: 'Transformation',
    target: '5+ Advisors / Multi-Location',
    price: '$1,497',
    setup: '$8,000',
    features: [
      'Everything in Growth',
      'Fleet Documentation Suite',
      'Custom AI workflows',
      'Multi-location support',
      'Dedicated account manager',
      'Quarterly strategy reviews',
    ],
    featured: false,
  },
]

const COMPARISON = [
  { feature: 'AI Scheduling Agent',           foundation: true,  growth: true,  transformation: true  },
  { feature: 'Declined Service Follow-Up',    foundation: true,  growth: true,  transformation: true  },
  { feature: 'Customer Re-Engagement System', foundation: false, growth: true,  transformation: true  },
  { feature: 'DVI Video Summarizer',          foundation: false, growth: true,  transformation: true  },
  { feature: 'Fleet Documentation Suite',     foundation: false, growth: false, transformation: true  },
  { feature: 'Custom AI Workflows',           foundation: false, growth: false, transformation: true  },
  { feature: 'Multi-Location Support',        foundation: false, growth: false, transformation: true  },
  { feature: 'Monthly Performance Reports',   foundation: true,  growth: true,  transformation: true  },
  { feature: 'Dedicated Account Manager',     foundation: false, growth: false, transformation: true  },
]

const FAQ = [
  {
    q: "Are there any hidden fees?",
    a: "No. Your monthly subscription and one-time setup fee are the only costs. We don't charge per message, per booking, or per automation run. Flat pricing — full transparency.",
  },
  {
    q: "What's the setup fee for?",
    a: "The setup fee covers the custom build of your automations — integrations, messaging calibration, workflow mapping, and our launch process. It's a one-time cost per engagement.",
  },
  {
    q: "Is the 12-month contract required?",
    a: "Yes. Building and optimizing AI automations for your specific shop takes time. The 12-month term ensures we can deliver the full impact of the system. After your first year, you continue month-to-month.",
  },
  {
    q: "Can I upgrade my tier mid-contract?",
    a: "Yes. If your shop outgrows your current tier, we can upgrade you at any time. You'll pay the difference in setup costs and the new monthly rate from the upgrade date.",
  },
]

function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={styles.accordionItem}>
      <button className={styles.accordionBtn} onClick={onToggle} aria-expanded={isOpen}>
        <span className={styles.accordionTitle}>{question}</span>
        <svg
          className={`${styles.accordionIcon} ${isOpen ? styles.accordionIconOpen : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            className={styles.accordionBody}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
            style={{ overflow: 'hidden' }}
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="Included">
    <circle cx="8" cy="8" r="7" stroke="#E02020" strokeWidth="1" />
    <path d="M5 8l2 2 4-4" stroke="#E02020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Dash = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="Not included">
    <line x1="4" y1="8" x2="12" y2="8" stroke="#2A2A2A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export default function Pricing({ setOverlayOpen }) {
  useScrollTriggerCleanup()
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className={`container ${styles.pageHeroInner}`}>
          <span className={styles.pageEyebrow}>Investment</span>
          <h1 className={styles.pageHeadline}>
            Enterprise AI.<br />
            SMB Pricing.
          </h1>
          <p className={styles.pageSubhead}>Flat rates. No usage fees. No surprises.</p>
        </div>
      </section>

      {/* Tier Cards */}
      <section className={styles.pageSection}>
        <div className={styles.sectionInner}>
          <div className={styles.pricingGrid}>
            {TIERS.map((tier) => (
              <div key={tier.name} className={`${styles.pricingCard} ${tier.featured ? styles.featured : ''}`}>
                {tier.featured && (
                  <div className={styles.pricingBadge}>Most Popular</div>
                )}
                <span className={styles.pricingTierName}>{tier.name}</span>
                <span className={styles.pricingTarget}>{tier.target}</span>
                <div>
                  <span className={styles.pricingAmount}>{tier.price}</span>
                  <span className={styles.pricingAmountSuffix}>/mo</span>
                </div>
                <span className={styles.pricingSetup}>+ {tier.setup} setup · 12-month contract</span>
                <p className={styles.pricingIncludes}>Includes</p>
                <ul className={styles.pricingFeatures}>
                  {tier.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                <button
                  className={tier.featured ? 'btn-primary' : 'btn-ghost'}
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => setOverlayOpen && setOverlayOpen('discovery')}
                >
                  Book Discovery Call
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className={`${styles.pageSection} ${styles.pageSectionAlt}`}>
        <div className={styles.sectionInner}>
          <span className={styles.sectionEyebrow}>Feature Comparison</span>
          <h2 className={styles.sectionTitle}>What's Included in Each Tier.</h2>
          <div style={{ overflowX: 'auto', marginTop: '2.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', paddingBottom: '1.25rem', fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mid-gray)', borderBottom: '1px solid var(--steel)' }}>
                    Feature
                  </th>
                  {['Foundation', 'Growth', 'Transformation'].map(t => (
                    <th key={t} style={{ textAlign: 'center', paddingBottom: '1.25rem', fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: t === 'Growth' ? 'var(--red)' : 'var(--mid-gray)', borderBottom: '1px solid var(--steel)', paddingLeft: '1rem' }}>
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '1rem 0', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 300, color: 'var(--light-gray)' }}>
                      {row.feature}
                    </td>
                    <td style={{ textAlign: 'center', paddingLeft: '1rem' }}><Check /></td>
                    <td style={{ textAlign: 'center', paddingLeft: '1rem' }}>{row.growth ? <Check /> : <Dash />}</td>
                    <td style={{ textAlign: 'center', paddingLeft: '1rem' }}>{row.transformation ? <Check /> : <Dash />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className={styles.pageSection}>
        <div className={styles.sectionInner} style={{ textAlign: 'center' }}>
          <span className={styles.sectionEyebrow}>Risk-Free</span>
          <div className={styles.guaranteeCallout}>
            <span className={styles.guaranteeCalloutNum}>90</span>
            <h3 className={styles.guaranteeCalloutTitle}>
              10 Lapsed Customers Back in 90 Days.
            </h3>
            <p className={styles.guaranteeCalloutDesc}>
              Or we keep working at no additional cost until we get there. This guarantee applies to Growth and Transformation tiers. No asterisks. No fine print.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${styles.pageSection} ${styles.pageSectionAlt}`}>
        <div className={styles.sectionInner}>
          <span className={styles.sectionEyebrow}>Pricing Questions</span>
          <h2 className={styles.sectionTitle}>Straight Answers.</h2>
          <div className={styles.accordion}>
            {FAQ.map((item, i) => (
              <AccordionItem
                key={i}
                question={item.q}
                answer={item.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.pageSection}>
        <div style={{ textAlign: 'center' }}>
          <h2 className={styles.ctaBannerTitle}>
            Ready to Pick a Plan?
          </h2>
          <p className={styles.ctaBannerSub}>
            Book a 20-minute discovery call and we'll tell you which tier is the right fit for your shop.
          </p>
          {setOverlayOpen && (
            <button className="btn-primary" onClick={() => setOverlayOpen('discovery')}>
              Book a Discovery Call
            </button>
          )}
        </div>
      </section>
    </>
  )
}
