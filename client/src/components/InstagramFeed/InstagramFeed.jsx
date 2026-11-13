import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ExternalLink, Instagram, Play, X } from 'lucide-react'
import { apiUrl } from '../../utils/apiBaseUrl'
import './InstagramFeed.css'

/*
  "Fresh from Instagram": every video / reel of the account in two slow-moving rows.
  Row 1 moves left to right, row 2 moves right to left. Hover pauses; click plays the video.
  The data comes from /api/instagram (official Instagram API, see server/src/routes/instagram.js).
  With no token configured the API returns an empty list and this section renders nothing.
*/
const DEFAULT_USERNAME = 'tripscapeadventures'
const MIN_CARDS_PER_SET = 10 // short lists are repeated so the row always fills the screen

let feedPromise = null
function loadFeed() {
  if (!feedPromise) {
    feedPromise = fetch(apiUrl('/api/instagram'))
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
  // Longer lists scroll for longer, so the speed stays calm however many videos there are.
  const seconds = Math.max(45, Math.round(cards.length * 4.5))
  return (
    <div className={`ig-row ig-row--${direction}`} style={{ '--ig-seconds': `${seconds}s` }}>
      <div className="ig-track">
        {[0, 1].map((copy) => (
          <ul className="ig-set" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>
            {cards.map((item, index) => (
              <li key={`${copy}-${item.id}-${index}`}>
                <button
                  type="button"
                  className="ig-card"
                  tabIndex={copy === 1 ? -1 : 0}
                  onClick={() => onOpen(item)}
                  aria-label={item.caption ? `Play video: ${item.caption}` : 'Play Instagram video'}
                >
                  {item.thumbnail && <img src={item.thumbnail} alt="" loading="lazy" decoding="async" draggable="false" />}
                  <span className="ig-card__shade" aria-hidden="true" />
                  <span className="ig-card__play" aria-hidden="true"><Play size={20} fill="currentColor" /></span>
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
  const [failed, setFailed] = useState(false)
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="ig-modal" role="dialog" aria-modal="true" aria-label="Instagram video" onClick={onClose}>
      <div className="ig-modal__box" onClick={(event) => event.stopPropagation()}>
        <button type="button" ref={closeRef} className="ig-modal__close" onClick={onClose} aria-label="Close video"><X size={20} /></button>
        <div className="ig-modal__media">
          {item.videoUrl && !failed
            ? <video src={item.videoUrl} poster={item.thumbnail || undefined} controls autoPlay playsInline loop onError={() => setFailed(true)} />
            : <div className="ig-modal__fallback">{item.thumbnail && <img src={item.thumbnail} alt="" />}<p>This video plays on Instagram.</p></div>}
        </div>
        <div className="ig-modal__foot">
          {item.caption && <p>{item.caption}</p>}
          <a href={item.permalink} target="_blank" rel="noopener noreferrer"><Instagram size={16} /> Watch on Instagram <ExternalLink size={14} /></a>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default function InstagramFeed() {
  const [feed, setFeed] = useState(null)
  const [active, setActive] = useState(null)

  useEffect(() => {
    let alive = true
    // Load after the page is idle so the feed never competes with the main content.
    const run = () => loadFeed().then((data) => { if (alive && data?.items?.length) setFeed(data) })
    const handle = 'requestIdleCallback' in window ? window.requestIdleCallback(run, { timeout: 3000 }) : window.setTimeout(run, 1500)
    return () => {
      alive = false
      if ('cancelIdleCallback' in window && typeof handle === 'number') window.cancelIdleCallback(handle)
    }
  }, [])

  const items = feed?.items || []
  // The second row starts from the middle of the list so the two rows never look identical.
  const secondRow = useMemo(() => {
    const middle = Math.floor(items.length / 2)
    return [...items.slice(middle), ...items.slice(0, middle)]
  }, [items])

  if (!items.length) return null
  const username = feed.username || DEFAULT_USERNAME

  return (
    <section className={`ig-section${active ? ' is-paused' : ''}`} aria-labelledby="ig-title">
      <div className="ig-head">
        <span className="ig-kicker">Follow our journey</span>
        <h2 id="ig-title">Fresh from Instagram</h2>
        <p>The latest videos from @{username}.</p>
        <a className="ig-follow" href={`https://www.instagram.com/${username}/`} target="_blank" rel="noopener noreferrer"><Instagram size={17} /> Follow @{username}</a>
      </div>
      <Row items={items} direction="right" onOpen={setActive} />
      <Row items={secondRow} direction="left" onOpen={setActive} />
      {active && <VideoModal item={active} onClose={() => setActive(null)} />}
    </section>
  )
}
