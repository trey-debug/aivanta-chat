import styles from '../styles/footer.module.css'

const PAGE_LINKS = [
  { label: 'Home',     href: '#hero' },
  { label: 'Services', href: '#solution' },
  { label: 'Process',  href: '#process' },
  { label: 'Pricing',  href: '#pricing' },
]

const SERVICE_LINKS = [
  'AI Scheduling Agent',
  'Declined Service Follow-Up',
  'Fleet Documentation Suite',
  'Customer Re-Engagement',
  'DVI Video Summarizer',
]

function scrollTo(href) {
  const el = document.querySelector(href)
  if (el && window.__lenis) window.__lenis.scrollTo(el, { offset: -72 })
  else if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer({ setOverlayOpen }) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>

          {/* Col 1 — Logo + tagline */}
          <div>
            <span className={styles.logo}>
              <span>AI</span><span className={styles.logoRed}>VANTA</span>
            </span>
            <p className={styles.tagline}>
              Done-for-you AI automation built exclusively for automotive repair shops.
              Give your team their time back.
            </p>
          </div>

          {/* Col 2 — Pages */}
          <div className={styles.col}>
            <h4>Navigation</h4>
            <ul>
              {PAGE_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a onClick={() => scrollTo(href)}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div className={styles.col}>
            <h4>Services</h4>
            <ul>
              {SERVICE_LINKS.map(service => (
                <li key={service}>
                  <a onClick={() => scrollTo('#solution')}>{service}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div className={styles.col}>
            <h4>Contact</h4>
            <p className={styles.contactInfo}>
              Palm Harbor, Florida<br />
              hello@aivantaautomations.com
            </p>
            <button className={styles.bookBtn} onClick={() => setOverlayOpen('discovery')}>
              Book a Call
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <span className={styles.copy}>
            &copy; 2026 AIVANTA Automations, LLC. All rights reserved. Palm Harbor, Florida.
          </span>
          <span className={styles.byline}>
            Faith-Founded. Precision-Built. Partner-Obsessed.
          </span>
        </div>
      </div>
    </footer>
  )
}
