import { useEffect, useRef, useState } from 'react'

const OVERLAP = 1.5 // seconds before the end when the next copy starts and cross-fades in

// Seamless looping background video: two stacked copies hand over to each other,
// so the end of the clip dissolves into its beginning instead of jumping back.
export default function HeroVideo({ src, poster, onError }) {
  const refs = [useRef(null), useRef(null)]
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)

  useEffect(() => {
    const [a, b] = [refs[0].current, refs[1].current]
    if (!a || !b) return undefined
    const videos = [a, b]
    let switching = false

    const handover = () => {
      const from = videos[activeRef.current]
      const to = videos[1 - activeRef.current]
      switching = true
      to.currentTime = 0
      to.play().catch(() => {})
      activeRef.current = 1 - activeRef.current
      setActive(activeRef.current)
      // Once the fade is over, park the old copy at the start.
      setTimeout(() => { from.pause(); from.currentTime = 0; switching = false }, OVERLAP * 1000 + 200)
    }

    const onTime = (event) => {
      const video = event.currentTarget
      if (video !== videos[activeRef.current] || switching) return
      if (video.duration > OVERLAP * 2 && video.duration - video.currentTime <= OVERLAP) handover()
    }
    const onEnded = (event) => { // safety net if timeupdate missed the window
      if (event.currentTarget === videos[activeRef.current] && !switching) handover()
    }

    videos.forEach((video) => { video.addEventListener('timeupdate', onTime); video.addEventListener('ended', onEnded) })
    a.play().catch(() => {})
    return () => videos.forEach((video) => { video.removeEventListener('timeupdate', onTime); video.removeEventListener('ended', onEnded); video.pause() })
  }, [])

  return (
    <>
      {[0, 1].map((i) => (
        <video
          key={i}
          ref={refs[i]}
          className={`tp-hero__video${active === i ? ' is-active' : ''}`}
          muted
          playsInline
          preload="auto"
          poster={i === 0 ? poster : undefined}
          aria-hidden="true"
          tabIndex={-1}
          onError={onError}
        >
          <source src={src} type="video/mp4" onError={onError} />
        </video>
      ))}
    </>
  )
}
