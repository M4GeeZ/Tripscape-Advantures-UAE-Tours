import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      infinite: false
    })

    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const reveals = gsap.utils.toArray('[data-reveal]')
    const animations = reveals.map((element) =>
      gsap.fromTo(
        element,
        { y: 42, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true
          }
        }
      )
    )

    return () => {
      animations.forEach((animation) => animation.kill())
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
}
