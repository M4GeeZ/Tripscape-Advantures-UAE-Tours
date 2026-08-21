import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useLuxuryReveal(scopeRef) {
  useLayoutEffect(() => {
    if (!scopeRef.current) return undefined

    const context = gsap.context(() => {
      const heroItems = gsap.utils.toArray('[data-hero-reveal]')
      gsap.set(heroItems, {
        opacity: 0,
        y: 26,
        filter: 'blur(9px)',
        clipPath: 'inset(0 0 100% 0)'
      })

      gsap.to(heroItems, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.15,
        ease: 'power4.out',
        stagger: 0.14,
        delay: 0.16,
        clearProps: 'filter,clipPath,transform'
      })

      gsap.utils.toArray('[data-lux-reveal]').forEach((element) => {
        const delay = Number(element.dataset.revealDelay || 0)
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 38,
            filter: 'blur(7px)'
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1,
            delay,
            ease: 'power3.out',
            clearProps: 'filter,transform',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })
    }, scopeRef)

    return () => context.revert()
  }, [scopeRef])
}
