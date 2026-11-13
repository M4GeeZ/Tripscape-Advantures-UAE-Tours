import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ExternalLink, Play, X, Youtube } from 'lucide-react'
import { apiUrl } from '../../utils/apiBaseUrl'
import '../InstagramFeed/InstagramFeed.css'
import './YoutubeFeed.css'

/*
  "Watch on YouTube": every public video and Short of the channel in two slow-moving rows.
  Row 1 moves right to left, row 2 moves left to right. Hover pauses; click plays the video.
  Data comes from /api/youtube (Vercel function api/youtube.js, needs YOUTUBE_API_KEY).
  Without data the section renders nothing.
*/
const MIN_CARDS_PER_SET = 10

let feedPromise = null
function loadFeed() {
  if (!feedPromise) {
    feedPromise = fetch(apiUrl('/api/youtube'))
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null)
  }
  return feedPromise
}

function repeatToFill(items) {
  const out = []
  while (out.length < MIN_CARDS_PER_SET) out.push(...items)
  return out
}

function Row({ items, direction, onOpen }) {
  const cards = useMemo(() => repeatToFill(items), [items])
  const seconds = Math.max(45, Math.round(cards.length * 4.5))
  return (
    <div className={`ig-row ig-row--${direction}`} style={{ '--ig-seconds': `${seconds}s` }}>
      <div className="ig-track">
        {[0, 1].map((copy) => (
          <ul className="ig-set" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>
            {cards.map((item, index) => (
              <li key={`${copy}-${item.id}-${index}`}>
                <button type="button" className="ig-card yt-card" tabIndex={copy === 1 ? -1 : 0} onClick={() => onOpen(item)} aria-label={`Play video: ${item.title}`}>
                  <img src={item.thumbnail} alt="" loading="lazy" decoding="async" draggable="false" />
                  <span className="ig-card__shade" aria-hidden="true" />
                  <span className="ig-card__play yt-card__play" aria-hidden="true"><Play size={20} fill="currentColor" /></span>
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

function VideoModal({ item, onClose }) {
  const closeRef = useRef(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="ig-modal" role="dialog" aria-modal="true" aria-label="YouTube video" onClick={onClose}>
      <div className="ig-modal__box yt-modal__box" onClick={(event) => event.stopPropagation()}>
        <button type="button" ref={closeRef} className="ig-modal__close" onClick={onClose} aria-label="Close video"><X size={20} /></button>
        <div className="ig-modal__media yt-modal__media">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0&playsinline=1`}
            title={item.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
        <div className="ig-modal__foot">
          {item.title && <p>{item.title}</p>}
          <a href={`https://www.youtube.com/watch?v=${item.id}`} target="_blank" rel="noopener noreferrer"><Youtube size={16} /> Watch on YouTube <ExternalLink size={14} /></a>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default function YoutubeFeed() {
  const [feed, setFeed] = useState(null)
  const [active, setActive] = useState(null)

  useEffect(() => {
    let alive = true
    const run = () => loadFeed().then((data) => { if (alive && data?.items?.length) setFeed(data) })
    const handle = 'requestIdleCallback' in window ? window.requestIdleCallback(run, { timeout: 3000 }) : window.setTimeout(run, 1500)
    return () => {
      alive = false
      if ('cancelIdleCallback' in window && typeof handle === 'number') window.cancelIdleCallback(handle)
    }
  }, [])

  const items = feed?.items || []
  const secondRow = useMemo(() => {
    const middle = Math.floor(items.length / 2)
    return [...items.slice(middle), ...items.slice(0, middle)]
  }, [items])

  if (!items.length) return null
  const channel = String(feed.channel || 'TripscapeAdventuresTourism').replace(/^@/, '')

  return (
    <section className={`ig-section yt-section${active ? ' is-paused' : ''}`} aria-labelledby="yt-title">
      <div className="ig-head">
        <span className="ig-kicker">Watch our adventures</span>
        <h2 id="yt-title">Fresh from YouTube</h2>
        <p>Every video and Short from @{channel}.</p>
        <a className="ig-follow" href={`https://www.youtube.com/@${channel}`} target="_blank" rel="noopener noreferrer"><Youtube size={17} /> Subscribe on YouTube</a>
      </div>
      <Row items={items} direction="left" onOpen={setActive} />
      <Row items={secondRow} direction="right" onOpen={setActive} />
      {active && <VideoModal item={active} onClose={() => setActive(null)} />}
    </section>
  )
}
