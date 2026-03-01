import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Kills all ScrollTrigger instances on component unmount.
 * Call this in any page component that uses ScrollTrigger.
 */
export function useScrollTriggerCleanup() {
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])
}
