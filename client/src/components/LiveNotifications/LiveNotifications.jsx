import { useCallback, useEffect, useRef, useState } from 'react'
import { BadgeCheck, Gift, Star, X } from 'lucide-react'
import { apiUrl } from '../../utils/apiBaseUrl'
import { claimPromo, fetchOffer, formatAed } from '../../utils/promoOffers'
import { isDisplayableReview } from '../../utils/reviews'
import { googleReviews } from '../../data/googleReviews'
import './LiveNotifications.css'

const MIN_GAP_MS = 5000
const MAX_GAP_MS = 20000
const PROMO_MIN_GAP_MS = 30000
const PROMO_MAX_GAP_MS = 40000
const PROMO_VISIBLE_SECONDS = 10
const SOCIAL_VISIBLE_MS = 6500
const MOBILE_QUERY = '(max-width: 640px)'

const randomGap = () => MIN_GAP_MS + Math.floor(Math.random() * (MAX_GAP_MS - MIN_GAP_MS + 1))
const randomPromoGap = () => PROMO_MIN_GAP_MS + Math.floor(Math.random() * (PROMO_MAX_GAP_MS - PROMO_MIN_GAP_MS + 1))
const pick = (items) => items[Math.floor(Math.random() * items.length)]
const isMobile = () => window.matchMedia?.(MOBILE_QUERY).matches

function timeAgo(date) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 60000))
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.round(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

const truncate = (text, max = 96) => (text.length > max ? `${text.slice(0, max).trim()}…` : text)

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const field = document.createElement('textarea')
    field.value = text
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.appendChild(field)
    field.select()
    const copied = document.execCommand('copy')
    field.remove()
    return copied
  }
}

// Real bookings (anonymised by the API) and published reviews only.
function useSocialFeed() {
  const [feed, setFeed] = useState({ bookings: [], reviews: [] })

  useEffect(() => {
    const load = (path) => fetch(apiUrl(path)).then((res) => (res.ok ? res.json() : [])).catch(() => [])
    Promise.all([load('/api/bookings/recent'), load('/api/reviews')]).then(([bookings, reviews]) => {
      setFeed({
        bookings: Array.isArray(bookings) ? bookings.filter((item) => item?.name && item?.tourTitle) : [],
        // Admin-published reviews plus the real Google reviews already shown on the site.
        reviews: [
          ...(Array.isArray(reviews) ? reviews : []),
          ...googleReviews.map((item) => ({ ...item, rating: item.stars, source: 'Google' })),
        ].filter((item) => Number(item.rating) >= 4 && isDisplayableReview(item)),
      })
    })
  }, [])

  return feed
}

function PromoToast({ offer, secondsLeft, onClose }) {
  const [copied, setCopied] = useState(false)
  const [claimError, setClaimError] = useState('')

  const handleCopy = async () => {
    await copyText(offer.code)
    setCopied(true)
    if (!(await claimPromo(offer))) setClaimError('This code just expired. Watch for the next offer.')
  }

  const handleBook = async () => {
    await claimPromo(offer)
    window.location.href = offer.href
  }

  return (
    <div className="live-promo" role="dialog" aria-label={`Save ${offer.percent}% on ${offer.title}`}>
      <button type="button" className="live-close" onClick={onClose} aria-label="Close offer"><X size={16} /></button>
      <span className="live-promo__icon"><Gift size={24} /></span>
      <span className="live-promo__eyebrow">Limited time offer</span>
      <h4>Save {offer.percent}% Today</h4>
      <p>
        On <strong>{offer.title}</strong> — now {formatAed(offer.discountedPrice)} instead of {formatAed(offer.basePrice)}. Valid for new bookings this week.
      </p>
      <div className="live-promo__code">
        <span>{offer.code}</span>
        <button type="button" onClick={handleCopy}>{copied ? 'Copied ✓' : 'Copy code'}</button>
      </div>
      {copied && !claimError && <small className="live-promo__applied">Code copied! Paste it in the “Promo code” box of this tour’s booking form and press Apply.</small>}
      {claimError && <small className="live-promo__applied live-promo__applied--error">{claimError}</small>}
      <button type="button" className="live-promo__cta" onClick={handleBook}>View this tour</button>
      <small className="live-promo__timer">Auto-hides in <b>{secondsLeft}</b>s</small>
    </div>
  )
}

function SocialToast({ item, onClose }) {
  return (
    <div className="live-social" role="status">
      <button type="button" className="live-close live-close--light" onClick={onClose} aria-label="Close notification"><X size={16} /></button>
      <span className="live-social__label">{item.type === 'booking' ? 'Recent booking' : 'Guest review'}</span>
      <div className="live-social__row">
        <span className="live-social__avatar">{item.name.charAt(0)}</span>
        {item.type === 'booking' ? (
          <div>
            <p><strong>{item.name}</strong> booked <strong>{item.tourTitle}</strong></p>
            <small><BadgeCheck size={15} /> Verified booking · {timeAgo(item.createdAt)}</small>
          </div>
        ) : (
          <div>
            <span className="live-social__stars" aria-label={`${item.rating} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} fill={index < item.rating ? 'currentColor' : 'none'} />)}
            </span>
            <p>“{truncate(item.text, 130)}”</p>
            <small>— {item.name}{item.source ? `, ${item.source}` : ''}</small>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LiveNotifications() {
  const feed = useSocialFeed()
  const [offer, setOffer] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(PROMO_VISIBLE_SECONDS)
  const [social, setSocial] = useState(null)
  const visible = useRef({ promo: false, social: false })
  const lastOfferTitle = useRef('')

  visible.current = { promo: Boolean(offer), social: Boolean(social) }

  // Promo loop (bottom-right): random 30–40s gap (max ~2 per minute), then a 10s offer with countdown.
  useEffect(() => {
    let timer
    let cancelled = false
    const schedule = () => {
      timer = window.setTimeout(async () => {
        if (document.hidden || (isMobile() && visible.current.social)) return schedule()
        // Each popup gets a brand-new single-use code from the server.
        const next = await fetchOffer(lastOfferTitle.current)
        if (cancelled) return
        if (!next) return schedule()
        lastOfferTitle.current = next.title
        setSecondsLeft(PROMO_VISIBLE_SECONDS)
        setOffer(next)
      }, randomPromoGap())
    }
    if (!offer) schedule()
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [offer])

  useEffect(() => {
    if (!offer) return undefined
    if (secondsLeft <= 0) {
      setOffer(null)
      return undefined
    }
    const tick = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000)
    return () => window.clearTimeout(tick)
  }, [offer, secondsLeft])

  // Social-proof loop (bottom-left): random 5–20s gap, then a 6.5s booking or review.
  useEffect(() => {
    const pool = [
      ...feed.bookings.map((item) => ({ ...item, type: 'booking' })),
      ...feed.reviews.map((item) => ({ ...item, type: 'review' })),
    ]
    if (!pool.length) return undefined

    let gapTimer
    let hideTimer
    let lastItem = null
    const schedule = () => {
      gapTimer = window.setTimeout(() => {
        if (document.hidden || (isMobile() && visible.current.promo)) return schedule()
        const choices = pool.length > 1 ? pool.filter((item) => item !== lastItem) : pool
        lastItem = pick(choices)
        setSocial(lastItem)
        hideTimer = window.setTimeout(() => {
          setSocial(null)
          schedule()
        }, SOCIAL_VISIBLE_MS)
      }, randomGap())
    }
    schedule()
    return () => {
      window.clearTimeout(gapTimer)
      window.clearTimeout(hideTimer)
    }
  }, [feed])

  const closePromo = useCallback(() => setOffer(null), [])
  const closeSocial = useCallback(() => setSocial(null), [])

  return (
    <div className="live-notifications" aria-live="polite">
      <div className="live-slot live-slot--left">
        {social && <SocialToast key={`${social.type}-${social.name}-${social.createdAt || social.text}`} item={social} onClose={closeSocial} />}
      </div>
      <div className="live-slot live-slot--right">
        {offer && <PromoToast key={offer.code} offer={offer} secondsLeft={secondsLeft} onClose={closePromo} />}
      </div>
    </div>
  )
}
