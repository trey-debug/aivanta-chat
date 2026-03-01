import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useScrollTriggerCleanup } from '../hooks/useScrollTrigger.js'
import EngineSVG from '../components/EngineSVG.jsx'
import TransmissionSVG from '../components/TransmissionSVG.jsx'
import styles from '../styles/home.module.css'

// ---- Pain point data ----
const PAIN_POINTS = [
  {
    eyebrow: '01 / 05  ·  Scheduling',
    statement: 'Your phone rang while your advisor was with a customer. Nobody answered. That caller booked somewhere else.',
    keyPhrase: 'Nobody answered',
  },
  {
    eyebrow: '02 / 05  ·  Declined Services',
    statement: 'Ten customers declined services this week. Not one of them has heard from you since.',
    keyPhrase: 'Not one of them',
  },
  {
    eyebrow: '03 / 05  ·  Fleet Accounts',
    statement: "Your best fleet account got a call from a competitor yesterday. You haven't sent them a report in months.",
    keyPhrase: 'a competitor yesterday',
  },
  {
    eyebrow: '04 / 05  ·  Lapsed Customers',
    statement: "There are 340 customers in your CRM who haven't been back in over a year. They didn't leave. You just stopped talking to them.",
    keyPhrase: 'You just stopped talking to them',
  },
  {
    eyebrow: '05 / 05  ·  Inspection Videos',
    statement: "Your advisor watches every DVI video before calling the customer. That's 90 minutes of their day. Every day.",
    keyPhrase: '90 minutes of their day',
  },
]

// ---- Breakdown items ----
const BREAKDOWN = [
  { amount: '$31,200', desc: 'Declined services never followed up' },
  { amount: '$20,800', desc: 'Scheduling gaps and missed calls' },
  { amount: '$13,500', desc: 'Fleet accounts lost to poor communication' },
  { amount: '$8,500',  desc: 'Lapsed customers never re-engaged' },
]

// ---- Solution cards ----
const SOLUTIONS = [
  {
    num: '01',
    eyebrow: 'Scheduling',
    title: 'AI Scheduling Agent',
    desc: "Captures every call your team can't answer. Books the appointment, confirms it, and texts a reminder — automatically. No calls lost. No revenue leaked.",
    svg: 'engine',
  },
  {
    num: '02',
    eyebrow: 'Declined Services',
    title: 'Declined Service Follow-Up',
    desc: "Every customer who said 'not today' gets a personalized follow-up sequence that brings them back — without lifting a finger. The AI tracks, times, and sends.",
    svg: null,
  },
  {
    num: '03',
    eyebrow: 'Fleet Accounts',
    title: 'Fleet Documentation Suite',
    desc: 'Automated monthly reports, service histories, and proactive communication that makes your fleet clients feel like VIPs — before a competitor calls them first.',
    svg: 'transmission',
  },
  {
    num: '04',
    eyebrow: 'Lapsed Customers',
    title: 'Customer Re-Engagement',
    desc: "Your dormant customers aren't gone — they're waiting to be asked back. The AI identifies them, finds the right moment, and sends a message that actually lands.",
    svg: null,
  },
  {
    num: '05',
    eyebrow: 'Inspection Videos',
    title: 'DVI Video Summarizer',
    desc: 'Your advisor watches DVI videos. Our AI watches them first, summarizes the findings, and drafts the customer message in seconds — giving your team their time back.',
    svg: null,
  },
]

// Helper: highlight key phrase in a statement
function renderStatement(statement, keyPhrase) {
  if (!keyPhrase) return statement
  const idx = statement.indexOf(keyPhrase)
  if (idx === -1) return statement
  return (
    <>
      {statement.slice(0, idx)}
      <span className={styles.painKeyPhrase}>{keyPhrase}</span>
      {statement.slice(idx + keyPhrase.length)}
    </>
  )
}

export default function Home({ setOverlayOpen }) {
  useScrollTriggerCleanup()

  // Scene 1 refs
  const heroContentRef   = useRef(null)
  const heroEyebrowRef   = useRef(null)
  const heroSubRef       = useRef(null)
  const heroHeadlineRef  = useRef(null)

  // Scene 2 refs
  const painWrapperRef   = useRef(null)
  const painStickyRef    = useRef(null)
  const painPanelRefs    = useRef([])

  // Scene 3 refs
  const numberRef        = useRef(null)
  const numberDisplayRef = useRef(null)
  const breakdownRefs    = useRef([])

  // Scene 4 refs
  const solutionOuterRef  = useRef(null)
  const solutionStickyRef = useRef(null)
  const solutionTrackRef  = useRef(null)

  // Scene 5 refs
  const manifestoRef      = useRef(null)
  const manifestoQuoteRef = useRef(null)
  const manifestoAttribRef = useRef(null)

  // Scene 6 refs
  const foundingRef       = useRef(null)
  const foundingLeftRef   = useRef(null)
  const foundingRightRef  = useRef(null)

  // Scene 7 refs
  const guaranteeRef      = useRef(null)
  const guaranteeBorderRef = useRef(null)
  const guaranteeTitleRef  = useRef(null)
  const guaranteeDescRef   = useRef(null)

  // Scene 8 refs
  const ctaRef            = useRef(null)
  const ctaHeadlineRef    = useRef(null)
  const ctaBodyRef        = useRef(null)
  const ctaBtnsRef        = useRef(null)
  const ctaFootnoteRef    = useRef(null)

  const [activeDot, setActiveDot]         = useState(0)
  const [activeSolutionDot, setActiveSolutionDot] = useState(0)

  // ---- Scene 1: Hero entrance ----
  useEffect(() => {
    const eyebrow = heroEyebrowRef.current
    const sub     = heroSubRef.current
    const lines   = heroHeadlineRef.current?.querySelectorAll('.hero-line')

    gsap.fromTo(eyebrow,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' }
    )

    if (lines) {
      gsap.fromTo(lines,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, delay: 0.4, ease: 'power3.out' }
      )
    }

    gsap.fromTo(sub,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, delay: 0.7, ease: 'power2.out' }
    )

    if (heroContentRef.current) {
      ScrollTrigger.create({
        trigger: heroContentRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(heroContentRef.current, {
            opacity: 1 - self.progress * 1.5,
            scale: 1 - self.progress * 0.03,
          })
        },
      })
    }
  }, [])

  // ---- Scene 2: Pain Points (pinned scroll) ----
  useEffect(() => {
    if (!painWrapperRef.current || painPanelRefs.current.length < PAIN_POINTS.length) return

    painPanelRefs.current.forEach((panel, i) => {
      gsap.set(panel, { opacity: i === 0 ? 1 : 0, xPercent: i === 0 ? 0 : 100 })
    })

    const totalPanels    = PAIN_POINTS.length
    const scrollDistance = (totalPanels - 1) * 100

    const splits = painPanelRefs.current.map(panel => {
      const el = panel.querySelector('[data-split]')
      if (!el) return null
      try { return new SplitText(el, { type: 'words', wordsClass: 'word' }) }
      catch { return null }
    })

    const st = ScrollTrigger.create({
      trigger: painWrapperRef.current,
      start: 'top top',
      end: `+=${scrollDistance}vh`,
      pin: painStickyRef.current,
      scrub: 1,
      onUpdate: (self) => {
        const progress  = self.progress
        const panelIdx  = Math.min(Math.floor(progress * totalPanels), totalPanels - 1)
        const panelProg = (progress * totalPanels) - panelIdx

        setActiveDot(panelIdx)

        painPanelRefs.current.forEach((panel, i) => {
          if (i < panelIdx) {
            gsap.set(panel, { opacity: 0, xPercent: -100 })
          } else if (i === panelIdx) {
            if (panelProg < 0.2) {
              gsap.set(panel, { opacity: 1, xPercent: (1 - panelProg / 0.2) * 80 })
            } else if (panelProg > 0.8 && i < totalPanels - 1) {
              gsap.set(panel, { opacity: 1 - (panelProg - 0.8) / 0.2, xPercent: -(panelProg - 0.8) / 0.2 * 80 })
            } else {
              gsap.set(panel, { opacity: 1, xPercent: 0 })
            }
          } else {
            gsap.set(panel, { opacity: 0, xPercent: 100 })
          }
        })
      },
    })

    return () => {
      st.kill()
      splits.forEach(s => s?.revert())
    }
  }, [])

  // ---- Scene 3: The Number ----
  useEffect(() => {
    if (!numberDisplayRef.current || !numberRef.current) return

    const counter = { val: 0 }
    const st = ScrollTrigger.create({
      trigger: numberRef.current,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: 74000,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            if (numberDisplayRef.current) {
              numberDisplayRef.current.textContent = '$' + Math.floor(counter.val).toLocaleString()
            }
          },
        })

        breakdownRefs.current.forEach((el, i) => {
          if (!el) return
          gsap.to(el, { opacity: 1, y: 0, duration: 0.5, delay: 1 + i * 0.2, ease: 'power2.out' })
        })
      },
    })

    return () => st.kill()
  }, [])

  // ---- Scene 4: Horizontal Scroll Solutions ----
  useEffect(() => {
    if (!solutionOuterRef.current || !solutionTrackRef.current) return

    const totalCards = SOLUTIONS.length
    const st = ScrollTrigger.create({
      trigger: solutionOuterRef.current,
      start: 'top top',
      end: `+=${(totalCards - 1) * 100}vh`,
      pin: solutionStickyRef.current,
      scrub: 1,
      onUpdate: (self) => {
        const xPct = self.progress * (totalCards - 1) * -100
        gsap.set(solutionTrackRef.current, { xPercent: xPct / totalCards })
        const dotIdx = Math.min(Math.round(self.progress * (totalCards - 1)), totalCards - 1)
        setActiveSolutionDot(dotIdx)
      },
    })

    return () => st.kill()
  }, [])

  // ---- Scene 5: Manifesto SplitText reveal ----
  useEffect(() => {
    if (!manifestoRef.current || !manifestoQuoteRef.current) return

    let split = null
    try {
      split = new SplitText(manifestoQuoteRef.current, { type: 'words', wordsClass: 'word' })
    } catch { return }

    const words = manifestoQuoteRef.current.querySelectorAll('.word')

    const st = ScrollTrigger.create({
      trigger: manifestoRef.current,
      start: 'top 80%',
      end: 'bottom 30%',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        words.forEach((word, i) => {
          const wordProgress = Math.max(0, Math.min(1, (progress - i / words.length * 0.8) / (1 / words.length * 1.5)))
          word.style.opacity = 0.15 + wordProgress * 0.85
        })

        if (manifestoAttribRef.current) {
          const attribProgress = Math.max(0, (progress - 0.8) / 0.2)
          manifestoAttribRef.current.style.opacity = attribProgress
        }
      },
    })

    return () => {
      st.kill()
      split?.revert()
    }
  }, [])

  // ---- Scene 6: Founding Story slide-in ----
  useEffect(() => {
    if (!foundingRef.current) return

    gsap.fromTo(foundingLeftRef.current,
      { x: -60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: foundingRef.current, start: 'top 65%', once: true },
      }
    )
    gsap.fromTo(foundingRightRef.current,
      { x: 60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.15,
        scrollTrigger: { trigger: foundingRef.current, start: 'top 65%', once: true },
      }
    )
  }, [])

  // ---- Scene 7: Guarantee border sweep ----
  useEffect(() => {
    if (!guaranteeRef.current || !guaranteeBorderRef.current) return

    ScrollTrigger.create({
      trigger: guaranteeRef.current,
      start: 'top 60%',
      once: true,
      onEnter: () => {
        gsap.fromTo(guaranteeBorderRef.current,
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.inOut' }
        )
        gsap.to([guaranteeTitleRef.current, guaranteeDescRef.current], {
          opacity: 1, duration: 0.6, stagger: 0.15, delay: 0.8, ease: 'power2.out',
        })
      },
    })
  }, [])

  // ---- Scene 8: Final CTA stagger ----
  useEffect(() => {
    if (!ctaRef.current) return

    ScrollTrigger.create({
      trigger: ctaRef.current,
      start: 'top 65%',
      once: true,
      onEnter: () => {
        gsap.to(
          [ctaHeadlineRef.current, ctaBodyRef.current, ctaBtnsRef.current, ctaFootnoteRef.current],
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' }
        )
      },
    })
  }, [])

  return (
    <>
      {/* =============================================
          SCENE 1: HERO
          ============================================= */}
      <section id="hero" className={styles.hero}>
        <div className={styles.rivePlaceholder} aria-hidden="true">
          {/* HERO ANIMATION PLACEHOLDER — Rive asset will be inserted here */}
        </div>

        <div className={styles.heroContent} ref={heroContentRef}>
          <span className={styles.heroEyebrow} ref={heroEyebrowRef}>
            Built Exclusively for Automotive Repair Shops
          </span>

          <h1 className={styles.heroHeadline} ref={heroHeadlineRef}>
            <span className="hero-line" style={{ display: 'block' }}>
              The 90-Day AI
            </span>
            <span className="hero-line" style={{ display: 'block' }}>
              Supercharged Shop.
            </span>
          </h1>

          <p className={styles.heroSubheadline} ref={heroSubRef}>
            Give your team their time back.
          </p>
        </div>

        <div className={styles.scrollIndicator} aria-hidden="true">
          <span className={styles.scrollLabel}>Scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      <hr className={styles.rule} />

      {/* =============================================
          SCENE 2: PAIN POINTS (PINNED)
          ============================================= */}
      <section className={styles.painWrapper} ref={painWrapperRef}>
        <div className={styles.painSticky} ref={painStickyRef}>
          {PAIN_POINTS.map((point, i) => (
            <div
              key={i}
              className={styles.painPanel}
              ref={el => { painPanelRefs.current[i] = el }}
            >
              <span className={styles.painEyebrow}>{point.eyebrow}</span>
              <p className={styles.painStatement} data-split="true">
                {renderStatement(point.statement, point.keyPhrase)}
              </p>
            </div>
          ))}

          <div className={styles.painDots} aria-hidden="true">
            {PAIN_POINTS.map((_, i) => (
              <div
                key={i}
                className={`${styles.painDot} ${i === activeDot ? styles.painDotActive : ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      <hr className={styles.rule} />

      {/* =============================================
          SCENE 3: THE NUMBER
          ============================================= */}
      <section className={styles.numberScene} ref={numberRef}>
        <p ref={numberDisplayRef} className={styles.bigNumber} aria-label="$74,000">
          $0
        </p>

        <p className={styles.numberSub}>
          The average independent shop loses this every year. Silently.
        </p>

        <div className={styles.breakdownGrid}>
          {BREAKDOWN.map((item, i) => (
            <div
              key={i}
              className={styles.breakdownItem}
              ref={el => { breakdownRefs.current[i] = el }}
            >
              <span className={styles.breakdownAmount}>{item.amount}</span>
              <span className={styles.breakdownDesc}>{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <hr className={styles.rule} />

      {/* =============================================
          SCENE 4: HORIZONTAL SCROLL — AI SOLUTIONS
          ============================================= */}
      <section id="solution" className={styles.solutionOuter} ref={solutionOuterRef}>
        <div className={styles.solutionSticky} ref={solutionStickyRef}>
          <div className={styles.solutionTrack} ref={solutionTrackRef}>
            {SOLUTIONS.map((sol, i) => (
              <div key={i} className={styles.solutionCard}>
                <div className={styles.solutionCardBody}>
                  <span className={styles.solutionCardNum}>{sol.num}</span>
                  <span className={styles.solutionCardEyebrow}>{sol.eyebrow}</span>
                  <h2 className={styles.solutionCardTitle}>{sol.title}</h2>
                  <p className={styles.solutionCardDesc}>{sol.desc}</p>
                </div>
                {sol.svg === 'engine' && (
                  <EngineSVG className={styles.solutionCardSvg} width={200} height={150} />
                )}
                {sol.svg === 'transmission' && (
                  <TransmissionSVG className={styles.solutionCardSvg} width={200} height={150} />
                )}
              </div>
            ))}
          </div>

          <div className={styles.solutionDots} aria-hidden="true">
            {SOLUTIONS.map((_, i) => (
              <div
                key={i}
                className={`${styles.solutionDot} ${i === activeSolutionDot ? styles.solutionDotActive : ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      <hr className={styles.rule} />

      {/* =============================================
          SCENE 5: THE MANIFESTO
          ============================================= */}
      <section id="manifesto" className={styles.manifestoSection} ref={manifestoRef}>
        <div className={styles.manifestoInner}>
          <p className={styles.manifestoQuote} ref={manifestoQuoteRef}>
            Every missed call is a car that didn't come in. Every declined service is a repair your competitor will do. Every lapsed customer is revenue that walked out quietly. The AI sees all of it — and handles it.
          </p>
          <p className={styles.manifestoAttrib} ref={manifestoAttribRef}>
            — The AIVANTA Standard
          </p>
        </div>
      </section>

      <hr className={styles.rule} />

      {/* =============================================
          SCENE 6: FOUNDING STORY
          ============================================= */}
      <section id="process" className={styles.foundingSection} ref={foundingRef}>
        <div className={styles.foundingGrid}>
          <div className={styles.foundingLeft} ref={foundingLeftRef}>
            <div className={styles.foundingImagePlaceholder}>
              <span className={styles.foundingImageLabel}>Founder Photo</span>
            </div>
          </div>

          <div className={styles.foundingRight} ref={foundingRightRef}>
            <span className={styles.foundingEyebrow}>Our Story</span>
            <h2 className={styles.foundingHeadline}>
              Built by a Technician.<br />
              Trusted by Shops.
            </h2>
            <div className={styles.foundingBody}>
              <p>
                I spent years as a BMW technician watching the same problems play out every single day. Advisors buried in warranty calls. Declined services that were never followed up on. Customers who drifted away because nobody reached out. The shop was busy — but it was leaving money on the table every hour.
              </p>
              <p>
                I didn't build AIVANTA from a whiteboard. I built it from the shop floor. Every automation we offer exists because I lived the problem it solves — and I knew exactly what the fix needed to look like.
              </p>
              <p>
                This isn't generic AI software dressed up for auto repair. It's purpose-built, obsessively detailed, and backed by a 90-day guarantee because we know it works.
              </p>
            </div>
            <p className={styles.foundingSignature}>
              — Trey McCormick, Founder &amp; BMW Technician
            </p>
          </div>
        </div>
      </section>

      <hr className={styles.rule} />

      {/* =============================================
          SCENE 7: THE GUARANTEE
          ============================================= */}
      <section className={styles.guaranteeSection} ref={guaranteeRef}>
        <div className={styles.guaranteeBoxWrap}>
          <div className={styles.guaranteeBox}>
            <div className={styles.guaranteeBorder} ref={guaranteeBorderRef} />
            <span className={styles.guaranteeNum}>90</span>
            <span className={styles.guaranteeLabel}>Day Guarantee</span>
            <h3 className={styles.guaranteeTitle} ref={guaranteeTitleRef}>
              10 Lapsed Customers Back in Your Bay — or We Keep Working Until You Get There.
            </h3>
            <p className={styles.guaranteeDesc} ref={guaranteeDescRef}>
              Within 90 days of going live, AIVANTA's re-engagement system will bring back at least 10 customers who haven't been in over a year. If we don't reach that number, we keep running — at no additional cost — until we do.
            </p>
          </div>
        </div>
      </section>

      <hr className={styles.rule} />

      {/* =============================================
          SCENE 8: FINAL CTA
          ============================================= */}
      <section id="pricing" className={styles.ctaSection} ref={ctaRef}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaHeadline} ref={ctaHeadlineRef}>
            Spend Five Minutes With Our AI.<br />
            Get a Full Shop Assessment.
          </h2>
          <p className={styles.ctaBody} ref={ctaBodyRef}>
            Our AI agent will assess your shop's readiness, identify your specific revenue leaks, and tell you exactly which automations you qualify for. No forms. No sales calls. Just real answers about your shop.
          </p>
          <div className={styles.ctaBtns} ref={ctaBtnsRef}>
            <button className="btn-primary" onClick={() => setOverlayOpen('voice')}>
              Start Voice Assessment
            </button>
            <button className="btn-ghost" onClick={() => setOverlayOpen('text')}>
              Start Text Assessment
            </button>
          </div>
          <p className={styles.ctaFootnote} ref={ctaFootnoteRef}>
            Already know you're ready?{' '}
            <button className={styles.ctaDiscoveryLink} onClick={() => setOverlayOpen('discovery')}>
              Book a discovery call directly →
            </button>
          </p>
        </div>
      </section>
    </>
  )
}
