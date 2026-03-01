import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollTriggerCleanup } from '../hooks/useScrollTrigger.js'
import EngineSVG from '../components/EngineSVG.jsx'
import TransmissionSVG from '../components/TransmissionSVG.jsx'
import styles from '../styles/pages.module.css'

const SERVICES = [
  {
    num: '01',
    eyebrow: 'Scheduling',
    title: 'AI Scheduling Agent',
    desc: "Every missed call is a lost car. Your AI scheduling agent answers when your team can't — capturing the appointment, confirming it, and sending automated reminders so the customer actually shows up.",
    bullets: [
      '24/7 call capture — no call goes unanswered',
      'Instant appointment booking and confirmation',
      'Automated SMS/email reminders before the visit',
      'Seamless handoff notes for your service advisors',
    ],
    svg: 'engine',
    reversed: false,
  },
  {
    num: '02',
    eyebrow: 'Declined Services',
    title: 'Declined Service Follow-Up',
    desc: "When a customer declines a service, they're not saying no forever — they're saying not today. The AI follows up at exactly the right moment with the right message to bring them back before they forget.",
    bullets: [
      'Automatic tracking of every declined service',
      'Personalized multi-step follow-up sequences',
      'Timing optimized for maximum re-booking rate',
      'Full visibility dashboard for your service team',
    ],
    svg: null,
    reversed: true,
  },
  {
    num: '03',
    eyebrow: 'Fleet Accounts',
    title: 'Fleet Documentation Suite',
    desc: "Fleet clients are your highest-value relationships — and the easiest to lose to a competitor who communicates better. AIVANTA keeps your fleet accounts informed, documented, and loyal.",
    bullets: [
      'Automated monthly service reports per vehicle',
      'Proactive maintenance reminders by fleet schedule',
      'Communication logs your clients can reference',
      'Custom-branded reports that position you as the expert',
    ],
    svg: 'transmission',
    reversed: false,
  },
  {
    num: '04',
    eyebrow: 'Lapsed Customers',
    title: 'Customer Re-Engagement System',
    desc: "You have hundreds of customers who haven't been back in over a year. They didn't leave angry — they just drifted. The AI finds them, reaches out with a relevant reason to return, and books the appointment.",
    bullets: [
      'Automatic identification of lapsed customers from your CRM',
      'Personalized outreach based on service history',
      'Multi-channel follow-up (SMS + email)',
      '90-day guarantee: 10 lapsed customers back in 90 days',
    ],
    svg: null,
    reversed: true,
  },
  {
    num: '05',
    eyebrow: 'Inspection Videos',
    title: 'DVI Video Summarizer',
    desc: "Your advisors watch DVI videos so they can explain findings to customers. Our AI watches first, summarizes the findings in plain language, and drafts the customer message — in seconds, not minutes.",
    bullets: [
      'Instant AI analysis of DVI inspection footage',
      'Plain-language summaries for customer communication',
      'Pre-drafted advisor messages ready to send',
      'Saves 60–90 minutes per advisor per day',
    ],
    svg: null,
    reversed: false,
  },
]

export default function Services({ setOverlayOpen }) {
  useScrollTriggerCleanup()

  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className={`container ${styles.pageHeroInner}`}>
          <span className={styles.pageEyebrow}>What We Build</span>
          <h1 className={styles.pageHeadline}>
            Five Automations.<br />
            One Unstoppable Shop.
          </h1>
          <p className={styles.pageSubhead}>Done-for-you. Running while you sleep.</p>
        </div>
      </section>

      {/* Services list */}
      <section className={styles.pageSection}>
        <div className={styles.sectionInner}>
          {SERVICES.map((svc, i) => (
            <div key={i} className={`${styles.serviceRow} ${svc.reversed ? styles.reversed : ''}`}>
              <div className={styles.serviceText}>
                <span className={styles.serviceNum}>{svc.num}</span>
                <span className={styles.serviceEyebrow}>{svc.eyebrow}</span>
                <h2 className={styles.serviceTitle}>{svc.title}</h2>
                <p className={styles.serviceDesc}>{svc.desc}</p>
                <ul className={styles.serviceBullets}>
                  {svc.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
              <div className={styles.serviceAccent}>
                {svc.svg === 'engine' && (
                  <EngineSVG width={220} height={165} />
                )}
                {svc.svg === 'transmission' && (
                  <TransmissionSVG width={220} height={165} />
                )}
                {!svc.svg && (
                  <div className={styles.serviceAccentPlaceholder}>
                    <span className={styles.serviceAccentLabel}>Visual Asset</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={`${styles.pageSection} ${styles.pageSectionAlt}`}>
        <div className={styles.ctaBanner} style={{ padding: '4rem 0' }}>
          <h2 className={styles.ctaBannerTitle}>
            See Which Services Your Shop Qualifies For.
          </h2>
          <p className={styles.ctaBannerSub}>
            Talk to our AI advisor. Get a real assessment — no forms, no sales calls.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {setOverlayOpen && (
              <>
                <button className="btn-primary" onClick={() => setOverlayOpen('text')}>
                  Start Text Assessment
                </button>
                <button className="btn-ghost" onClick={() => setOverlayOpen('discovery')}>
                  Book a Discovery Call
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
