import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollTriggerCleanup } from '../hooks/useScrollTrigger.js'
import styles from '../styles/pages.module.css'

const TIMELINE = [
  {
    phase: 'Phase 1  ·  Days 1–14',
    title: 'Onboarding & Integration',
    desc: "We connect AIVANTA to your existing shop management software, CRM, and communication channels. No disruption to your current workflow — we build around what you already have. Your team gets a walkthrough, and we handle everything technical.",
  },
  {
    phase: 'Phase 2  ·  Days 15–45',
    title: 'Training & Launch',
    desc: "Each automation is calibrated to your shop's voice, pricing, and customer base. We run a controlled launch — monitoring response rates, fine-tuning messaging, and making sure every automation performs exactly the way it should before we scale.",
  },
  {
    phase: 'Phase 3  ·  Days 46–90',
    title: 'Optimize & Grow',
    desc: "With all automations live and tuned, we shift to performance optimization. You see monthly reports on revenue recovered, appointments booked, and customers re-engaged. We set the 90-day benchmark and make sure you hit it.",
  },
]

const FAQ = [
  {
    q: "How long does the onboarding process take?",
    a: "Most shops are fully live within 14 days of signing. The first week is integration and setup; the second week is calibration and team walkthrough. We handle the technical side — your team's only job is to review and approve messaging.",
  },
  {
    q: "Do I need to change my existing shop management software?",
    a: "No. AIVANTA integrates with the tools you already use — most major shop management systems, CRMs, and communication platforms. We build around your workflow, not the other way around.",
  },
  {
    q: "What does 'done-for-you' actually mean?",
    a: "It means we build it, we set it up, we monitor it, and we maintain it. You don't need to log into a dashboard every day or manage a software subscription. We run the system so your team can focus on the shop.",
  },
  {
    q: "How does the 90-day guarantee work?",
    a: "Within 90 days of your launch date, AIVANTA's re-engagement system will bring back at least 10 customers who haven't visited in over a year. If we don't reach that number, we keep running at no additional cost until we do — no asterisks.",
  },
  {
    q: "Will my customers know they're talking to AI?",
    a: "All AI-generated outreach is clearly branded as coming from your shop. We don't pretend to be a human advisor. The AI handles the scheduling, follow-up, and documentation — when a customer calls back or has a real question, your team takes over.",
  },
  {
    q: "What happens after the 90-day launch period?",
    a: "The automations keep running. We handle all maintenance, updates, and optimizations as part of your monthly subscription. You get a monthly performance report and direct access to our team for any changes.",
  },
  {
    q: "Can I start with just one automation instead of all five?",
    a: "Yes. Our Foundation tier includes two core automations, and you can add more as you grow. Most shops start with AI Scheduling and Declined Service Follow-Up — those two alone typically recover more than the monthly subscription cost within 60 days.",
  },
  {
    q: "Is there a long-term contract?",
    a: "Subscriptions are 12 months. This allows us to build and optimize the system properly — AI automations perform better over time as they're tuned to your specific shop and customer base. After 12 months, you continue month-to-month.",
  },
  {
    q: "What's the setup fee for?",
    a: "The setup fee covers the custom build of your automations — integrations, messaging calibration, workflow mapping, and the launch process. It's a one-time cost. Your monthly subscription covers maintenance, monitoring, and ongoing optimization.",
  },
  {
    q: "How do I get started?",
    a: "Book a discovery call. We'll learn about your shop, identify which automations will have the biggest impact, and walk you through what the onboarding process looks like for your specific setup. No commitment required.",
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

export default function Process({ setOverlayOpen }) {
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
          <span className={styles.pageEyebrow}>How It Works</span>
          <h1 className={styles.pageHeadline}>
            The 90-Day AI<br />
            Supercharged Shop.
          </h1>
          <p className={styles.pageSubhead}>Three phases. One result.</p>
        </div>
      </section>

      {/* Timeline */}
      <section className={styles.pageSection}>
        <div className={styles.sectionInner}>
          <span className={styles.sectionEyebrow}>The Launch Process</span>
          <h2 className={styles.sectionTitle}>From Zero to Running in 14 Days.</h2>
          <div className={styles.timeline}>
            {TIMELINE.map((item, i) => (
              <div key={i} className={styles.timelineItem}>
                <span className={styles.timelinePhase}>{item.phase}</span>
                <h3 className={styles.timelineTitle}>{item.title}</h3>
                <p className={styles.timelineDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee callout */}
      <section className={`${styles.pageSection} ${styles.pageSectionAlt}`}>
        <div className={styles.sectionInner} style={{ textAlign: 'center' }}>
          <span className={styles.sectionEyebrow}>The Guarantee</span>
          <div className={styles.guaranteeCallout}>
            <span className={styles.guaranteeCalloutNum}>90</span>
            <h3 className={styles.guaranteeCalloutTitle}>
              10 Lapsed Customers Back in 90 Days.
            </h3>
            <p className={styles.guaranteeCalloutDesc}>
              Or we keep working at no additional cost until you get there. No asterisks. No fine print. This is what we mean by Partner-Obsessed.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.pageSection}>
        <div className={styles.sectionInner}>
          <span className={styles.sectionEyebrow}>Common Questions</span>
          <h2 className={styles.sectionTitle}>Everything You Want to Know.</h2>
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

      {/* CTA */}
      <section className={`${styles.pageSection} ${styles.pageSectionAlt}`}>
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <h2 className={styles.ctaBannerTitle}>Ready to See It in Action?</h2>
          <p className={styles.ctaBannerSub}>
            Book a discovery call and we'll walk you through exactly what the process looks like for your shop.
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
