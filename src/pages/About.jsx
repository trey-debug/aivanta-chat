import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollTriggerCleanup } from '../hooks/useScrollTrigger.js'
import styles from '../styles/pages.module.css'

export default function About({ setOverlayOpen }) {
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
          <span className={styles.pageEyebrow}>Our Story</span>
          <h1 className={styles.pageHeadline}>
            Built by a Technician.<br />
            Trusted by Shops.
          </h1>
          <p className={styles.pageSubhead}>Precision-Built. Partner-Obsessed.</p>
        </div>
      </section>

      {/* Founding Story */}
      <section className={styles.pageSection}>
        <div className={styles.sectionInner}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '5rem', alignItems: 'start' }}>

            <div style={{ background: 'var(--charcoal)', border: '1px solid var(--steel)', aspectRatio: '4/5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--steel)' }}>
                Founder Photo
              </span>
            </div>

            <div>
              <span className={styles.sectionEyebrow}>The Origin</span>
              <h2 className={styles.sectionTitle}>
                I Lived Every Problem<br />AIVANTA Solves.
              </h2>
              <div className={styles.prose}>
                <p>
                  I spent years as a BMW technician on the shop floor — not in a corner office, not at a startup pitch deck. I watched advisors spend two hours on hold with warranty companies while the service lane backed up. I counted declined jobs stacked on the desk that were never followed up on. I saw the look on a fleet manager's face when he walked in because a competitor had been calling him every week and we hadn't sent a report in months.
                </p>
                <p>
                  The problem wasn't work ethic. Everyone in those shops worked incredibly hard. The problem was that the work nobody had time for — the follow-ups, the re-engagements, the documentation — was quietly costing the shop tens of thousands of dollars every year.
                </p>
                <p>
                  AIVANTA exists because I knew exactly what needed to be automated and exactly how it needed to feel. Not generic AI software with a car graphic slapped on it. Purpose-built, obsessively detailed automation for the shops I've worked in and the owners I've worked alongside.
                </p>
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--red)', fontSize: '1.1rem', marginTop: '2rem' }}>
                — Trey McCormick, Founder &amp; BMW Technician
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`${styles.pageSection} ${styles.pageSectionAlt}`}>
        <div className={styles.sectionInner}>
          <span className={styles.sectionEyebrow}>What We Stand On</span>
          <h2 className={styles.sectionTitle}>Three Principles. Non-Negotiable.</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <span className={styles.valueName}>Faith-Founded</span>
              <p className={styles.valueDesc}>
                We operate with integrity and a long-term view. We don't chase shortcuts. We build relationships with shop owners who deserve a partner they can trust — and we act accordingly in everything we do.
              </p>
            </div>
            <div className={styles.valueItem}>
              <span className={styles.valueName}>Precision-Built</span>
              <p className={styles.valueDesc}>
                Every automation we build is purpose-made for automotive repair. There's no out-of-the-box template here. We know the workflows, the terminology, and the pressure your team is under — and we build to that standard.
              </p>
            </div>
            <div className={styles.valueItem}>
              <span className={styles.valueName}>Partner-Obsessed</span>
              <p className={styles.valueDesc}>
                Our success is directly tied to yours. We don't win unless your shop wins. That's why we back everything with a 90-day guarantee — because we believe in the work, and we want you to as well.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Quote */}
      <section className={styles.pageSection}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 var(--container-pad)', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 300, fontStyle: 'italic', color: 'var(--off-white)', lineHeight: 1.25, marginBottom: '3rem' }}>
            "The AI does the work.<br />Your team makes the call."
          </h2>
          <p className={styles.prose} style={{ margin: '0 auto 3rem', textAlign: 'center' }}>
            We believe your advisors are at their best when they're in front of customers — not buried in follow-up calls, warranty paperwork, or re-engagement lists. AIVANTA handles the work that doesn't require a human so the humans on your team can do what only they can do.
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
