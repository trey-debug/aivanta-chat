import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/nav.module.css'

const NAV_LINKS = [
  { label: 'Services', to: '/services' },
  { label: 'Process',  to: '/process'  },
  { label: 'Pricing',  to: '/pricing'  },
  { label: 'About',    to: '/about'    },
]

export default function Nav({ setOverlayOpen }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      {/* Logo */}
      <Link to="/" className={styles.logo} aria-label="AIVANTA — home">
        <span>AI</span><span className={styles.logoRed}>VANTA</span>
      </Link>

      {/* Center links */}
      <ul className={styles.links}>
        {NAV_LINKS.map(({ label, to }) => (
          <li key={label}>
            <Link to={to}>{label}</Link>
          </li>
        ))}
      </ul>

      {/* Right CTA */}
      <button
        className={styles.cta}
        onClick={() => setOverlayOpen('text')}
        aria-label="Assess my shop with AI"
      >
        Assess My Shop
      </button>
    </nav>
  )
}
