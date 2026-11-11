import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight, ArrowUpRight, BadgeCheck, Camera, Check,
  CheckCircle2, ChevronLeft, ChevronRight, Clock3, Compass, Headphones,
  MapPin, Minus, ShieldCheck, Sparkles, Star, Users, X,
} from 'lucide-react'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import HeroVideo from '../../components/HeroVideo'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
import BookingEnquiryForm from '../../components/BookingEnquiryForm'
import { tourCatalog } from '../../data'
import { getTourDetail, getTourDetailHref } from '../../tourDetails'
import { apiUrl } from '../../utils/apiBaseUrl'
import { isDisplayableReview } from '../../utils/reviews'
import { googleReviews } from '../../data/googleReviews'
import { reviews as siteReviews } from '../../data'
import { getTourImages, MAX_TOUR_IMAGES, orderedImages, useTourImages } from '../../utils/tourImages'
import { applyTourPricing } from '../../utils/tourPricing'
import { resolveSchema, writePageSchema } from '../../utils/schemaManager'
import { canonicalUrl } from '../../utils/canonical'
import { applyMeta } from '../../SeoHead'
import { getSeoPage } from '../../seoPages'
import './TourDetail.css' // Retains existing loading / shared styles used by dynamic pages.
import './TourDetailPremium.css'

// Plays behind every tour hero (client/public/videos/hero/desert-safari.mp4); falls back to the photo if missing.
const HERO_VIDEO = '/videos/hero/desert-safari.mp4'
const WHATSAPP_NUMBER = '971549930684'
const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const asArray = (value) => Array.isArray(value) ? value.filter(Boolean) : []

function displayPriceOf(tour) {
  const raw = String(tour?.price || '').trim()
  return !raw || /^contact( for)? price$/i.test(raw) || /^(from\s*)?aed\s*0(?:\.0+)?$/i.test(raw)
    ? 'Contact for price'
    : raw
}

function SectionTitle({ kicker, title, copy, centered = false }) {
  return (
    <header className={`tp-section-title${centered ? ' tp-section-title--center' : ''}`}>
      {kicker && <span className="tp-kicker">{kicker}</span>}
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </header>
  )
}

// Existing, already-published reviews: Google reviews first, then the site's other traveller reviews.
const MAX_REVIEWS = 15
const fallbackReviews = (() => {
  const seen = new Set()
  const siteList = siteReviews.map((item, index) => ({
    id: `site-${index}`,
    name: String(item.name || '').replace(/â€™/g, "'"),
    rating: 5,
    text: item.text,
    source: [item.source === 'Google' ? 'Google review' : item.source, item.place].filter(Boolean).join(' · '),
  }))
  return [...googleReviews.map((item) => ({ ...item, rating: item.stars })), ...siteList].filter((item) => {
    const key = String(item.name).toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
})()

function usePublishedReviews() {
  const [reviews, setReviews] = useState(() => fallbackReviews.slice(0, MAX_REVIEWS))
  useEffect(() => {
    let active = true
    fetch(apiUrl('/api/reviews'))
      .then((response) => response.ok ? response.json() : [])
      .then((data) => {
        if (!active) return
        const published = asArray(data).filter(isDisplayableReview)
        setReviews([...published, ...fallbackReviews].slice(0, MAX_REVIEWS))
      })
      .catch(() => { if (active) setReviews(fallbackReviews.slice(0, MAX_REVIEWS)) })
    return () => { active = false }
  }, [])
  return reviews
}

function HeroPreview({ tour, images, price }) {
  const items = asArray(tour.included).slice(0, 4)
  // Slide through the same photos shown in the gallery, one every 3 seconds, looping.
  // Keyed by the photo list's content: `images` is rebuilt on every parent render and must not restart the timer.
  const slidesKey = getGalleryPhotos(images).join('|')
  const slides = useMemo(() => (slidesKey ? slidesKey.split('|') : []), [slidesKey])
  const [active, setActive] = useState(0)
  useEffect(() => {
    setActive(0)
    if (slides.length < 2) return undefined
    const timer = setInterval(() => setActive((current) => (current + 1) % slides.length), 3000)
    return () => clearInterval(timer)
  }, [slides])
  return (
    <aside className="tp-preview" aria-label="Experience preview">
      <div className="tp-preview__image">
        {(slides.length ? slides : [images[1] || images[0]]).map((src, i) => (
          <img key={`${i}-${src}`} src={src} alt={`${tour.title} experience ${i + 1}`} className={`tp-preview__slide${i === active ? ' is-active' : i === (active - 1 + slides.length) % slides.length ? ' is-prev' : ''}`} loading={i === 0 ? 'eager' : 'lazy'} />
        ))}
        <span className="tp-preview__tag"><Camera size={12} /> Experience preview</span>
        <span className="tp-preview__photo-label">Explore the experience <ArrowUpRight size={14} /></span>
      </div>
      <div className="tp-preview__body">
        <strong className="tp-preview__title">Your experience at a glance</strong>
        <ul>
          {(items.length ? items : ['Tour details confirmed with our team', 'Select your preferred date', 'Local booking support']).map((item, i) => (
            <li key={`${i}-${item}`}><CheckCircle2 size={13} /> <span>{item}</span></li>
          ))}
        </ul>
        <div className="tp-preview__footer">
          <span><small>Starting from</small><strong>{price}</strong></span>
          <a href="#book" className="tp-preview__link">Book Now <ArrowRight size={15} /></a>
        </div>
      </div>
    </aside>
  )
}

function IntroHighlights({ tour }) {
  const highlights = asArray(tour.included).slice(0, 3)
  const icons = [Compass, Camera, ShieldCheck]
  return (
    <div className="tp-highlights">
      {(highlights.length ? highlights : [
        'A memorable Dubai experience',
        'Dedicated booking assistance',
        'Information before your trip',
      ]).map((label, index) => {
        const Icon = icons[index % icons.length]
        return <div className="tp-highlight" key={`${index}-${label}`}><span><Icon size={19} /></span><strong>{label}</strong></div>
      })}
    </div>
  )
}

const BOOKING_STEPS = [
  { title: 'Choose your experience', description: 'Review the experience, select your travel date and add optional extras.' },
  { title: 'Send your booking request', description: 'Enter your guest and contact details using our secure enquiry form.' },
  { title: 'Our team confirms', description: 'We check availability, confirm arrangements and share the next steps.' },
  { title: 'Enjoy your adventure', description: 'Arrive with the booking details provided and enjoy your selected experience.' },
]

function BookingProcess({ process = null }) {
  const steps = process?.steps?.length ? process.steps : BOOKING_STEPS
  return (
    <div className="tp-process">
      {process
        ? <SectionTitle centered kicker="Effortless planning" title={process.title} copy={process.copy} />
        : <SectionTitle centered kicker="Effortless planning" title="How It Works: From Booking to the Desert" copy="A simple, guided booking journey with our team handling the details." />}
      <div className="tp-process__steps">
        {steps.map((step, i) => (
          <div className="tp-process__step" key={step.title}>
            <span className="tp-process__number">{String(i + 1).padStart(2, '0')}</span>
            <span className="tp-process__dot" aria-hidden="true" />
            <strong>{step.title}</strong>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// "Title: description" items render with a bold title; plain items render as one line.
function splitItem(text) {
  const value = String(text || '').trim()
  const match = value.match(/^([^:]{3,60}):s+(S[sS]*)$/)
  return match ? { title: match[1].trim(), detail: match[2].trim() } : { title: '', detail: value }
}

function InclusionItem({ text, excluded = false }) {
  const { title, detail } = splitItem(text)
  return (
    <li>
      {excluded
        ? <span className="tp-inclusions__cross" aria-hidden="true"><X size={10} strokeWidth={3} /></span>
        : <span className="tp-inclusions__tick" aria-hidden="true"><Check size={12} strokeWidth={3} /></span>}
      <span className="tp-inclusions__text">{title && <strong>{title}:</strong>} {detail}</span>
    </li>
  )
}

function Included({ tour }) {
  const included = asArray(tour.included)
  const excluded = asArray(tour.excluded)
  return (
    <section className="tp-inclusions" aria-label="Included and not included">
      <SectionTitle kicker="Transparent inclusions" title="Everything Included in Your Booking" copy="No hidden charges or mandatory resort fees. Every listed item below is guaranteed." />
      <div className="tp-inclusions__grid">
        <div className="tp-inclusions__box tp-inclusions__box--yes">
          <h3><span className="tp-inclusions__badge tp-inclusions__badge--yes"><Check size={14} strokeWidth={3} /></span> What is Included</h3>
          {included.length ? (
            <ul>{included.map((item, index) => <InclusionItem key={`${index}-${item}`} text={item} />)}</ul>
          ) : <p className="tp-inclusions__empty">Please ask our team for the confirmed inclusions of this experience.</p>}
        </div>
        <div className="tp-inclusions__box tp-inclusions__box--no">
          <h3><span className="tp-inclusions__badge tp-inclusions__badge--no"><Minus size={14} strokeWidth={3} /></span> Not Included (Optional)</h3>
          {excluded.length ? (
            <ul>{excluded.map((item, index) => <InclusionItem key={`${index}-${item}`} text={item} excluded />)}</ul>
          ) : <p className="tp-inclusions__empty">Optional extras and exclusions depend on the selected package. Contact our team for details.</p>}
          <div className="tp-inclusions__help"><Headphones size={20} /><span><strong>Need a tailored experience?</strong> Our team can help with special requests and custom arrangements.</span></div>
        </div>
      </div>
    </section>
  )
}

function getExperienceFlow(tour) {
  const items = asArray(tour.included)
  const name = tour.title || 'your experience'
  const isMorning = /morning|sunrise/i.test(name)
  const isEvening = /evening|sunset/i.test(name)
  const when = isMorning ? 'Morning' : isEvening ? 'Evening' : 'Your travel day'
  return [
    { title: `${when} · Arrival and welcome`, detail: 'Follow the meeting or pickup instructions confirmed by the booking team.', tip: 'Keep your booking details handy' },
    { title: 'Meet your local team', detail: 'Check in, review the experience plan and receive any applicable safety guidance.', tip: 'Ask questions before the experience' },
    { title: `${name} begins`, detail: items[0] || 'Enjoy the activities included in your selected package.', tip: 'Enjoy your selected tour activities' },
    { title: 'Experience the highlights', detail: items[1] || 'Take in the sights, attractions and special moments of your experience.', tip: 'Bring your camera for memories' },
    { title: 'Finish and onward arrangements', detail: 'Wrap up your adventure according to the confirmed tour schedule and arrangements.', tip: 'Check any return or drop-off details' },
  ]
}

function ExperienceFlow({ tour }) {
  const flow = getExperienceFlow(tour)
  return (
    <section className="tp-flow-section">
      <div className="tp-container">
        <SectionTitle centered kicker="Your experience timeline" title="Your Adventure Flow" copy="An overview of the journey. Exact timings and activities are confirmed for your selected package." />
        <ol className="tp-flow">
          {flow.map((step, index) => (
            <li key={step.title} className={`tp-flow__item${index % 2 ? ' tp-flow__item--right' : ''}`}>
              <div className="tp-flow__text"><span>STEP {String(index + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.detail}</p></div>
              <span className="tp-flow__node"><Compass size={18} /></span>
              <div className="tp-flow__tip"><CheckCircle2 size={16} /><span>{step.tip}</span></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

// Always 6 photos (3 per row): prefer images after the hero pair, then reuse earlier ones.
function getGalleryPhotos(images) {
  const pool = [...images.slice(2, MAX_TOUR_IMAGES), ...images.slice(0, 2)].filter(Boolean)
  const unique = [...new Set(pool)]
  if (!unique.length) return []
  return Array.from({ length: 6 }, (_, i) => unique[i % unique.length])
}

function Gallery({ images, tour, onOpen }) {
  const photos = getGalleryPhotos(images)
  if (!photos.length) return null
  return (
    <section className="tp-gallery-section">
      <div className="tp-container">
        <SectionTitle kicker="Visual journey" title="Moments Worth Remembering" copy="A glimpse into this experience." />
        <div className={`tp-gallery tp-gallery--${Math.min(photos.length, 4)}`}>
          {photos.map((image, index) => (
            <button type="button" key={`${image}-${index}`} className="tp-gallery__item" onClick={() => onOpen(index)} aria-label={`View ${tour.title} gallery photo ${index + 1}`}>
              <img src={image} alt={`${tour.title} gallery image ${index + 1}`} loading="lazy" />
              <span>Explore photo <ArrowUpRight size={16} /></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function Comparison({ tour }) {
  const included = asArray(tour.included)
  const rows = [
    ['Experience details', 'Tour-specific inclusions listed clearly', 'Details depend on the operator'],
    ['Booking assistance', 'WhatsApp and booking enquiry support', 'Support varies by operator'],
    ['Travel arrangements', 'Confirmed with your selected package', 'Conditions vary by package'],
    ['Optional extras', included.length ? 'Inclusions and add-ons presented upfront' : 'Ask for applicable extras before booking', 'Extra charges vary by operator'],
    ['Change requests', 'Contact the Tripscape team for options', 'Policies depend on the operator'],
  ]
  return (
    <section className="tp-comparison-section">
      <div className="tp-container tp-comparison-shell">
        <SectionTitle centered kicker="Compare your options" title="The Tripscape Difference" copy="Know what to check when comparing providers. Individual packages and policies may vary." />
        <div className="tp-comparison-scroll">
          <table className="tp-comparison">
            <thead><tr><th scope="col">Service & experience</th><th scope="col"><BadgeCheck size={18} /> Tripscape Adventures</th><th scope="col">Other operators</th></tr></thead>
            <tbody>{rows.map(([label, us, other]) => (
              <tr key={label}><th scope="row">{label}</th><td><CheckCircle2 size={16} /> {us}</td><td>{other}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// Placeholder profile photos (stored locally) keyed by reviewer first name; others fall back to an initial.
const REVIEWER_PHOTOS = ['ravindu', 'cara', 'davide', 'babita', 'oneil', 'ardelia', 'simon', 'priya', 'james', 'sophie', 'daniel']
function reviewerPhoto(name) {
  const first = String(name || '').trim().split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')
  return REVIEWER_PHOTOS.includes(first) ? `/images/reviewers/${first}.jpg` : ''
}

function Reviews({ reviews }) {
  const trackRef = useRef(null)
  const [progress, setProgress] = useState(25)

  const updateEdge = () => {
    const track = trackRef.current
    if (!track) return
    setProgress(Math.min(100, Math.round(((track.scrollLeft + track.clientWidth) / track.scrollWidth) * 100)))
  }

  useEffect(() => {
    updateEdge()
    window.addEventListener('resize', updateEdge)
    return () => window.removeEventListener('resize', updateEdge)
  }, [reviews.length])

  const slide = (direction) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('.tp-review-card')
    const step = card ? card.getBoundingClientRect().width + 15 : track.clientWidth
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4
    if (direction > 0 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' })
    else if (direction < 0 && track.scrollLeft <= 4) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' })
    else track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  if (!reviews.length) return null
  return (
    <section className="tp-reviews-section">
      <div className="tp-container">
        <SectionTitle centered kicker="Authentic guest experiences" title="Verified Explorer Reviews" copy="Published feedback shared by Tripscape customers." />
        <div className="tp-reviews-badge"><span className="tp-rating-label"><Star size={16} fill="currentColor" /> Guest experiences</span></div>
        <div className="tp-reviews" ref={trackRef} onScroll={updateEdge} tabIndex={0} aria-label="Customer reviews">
          {reviews.map((review, index) => (
            <article className="tp-review-card" key={review._id || `${review.name}-${index}`} style={{ '--i': index }}>
              <span className="tp-review-card__quote" aria-hidden="true">“</span>
              <div className="tp-review-card__top"><span className="tp-review-card__avatar">{reviewerPhoto(review.name) ? <img src={reviewerPhoto(review.name)} alt="" loading="lazy" width="46" height="46" /> : String(review.name || 'G').charAt(0)}</span><div><strong>{review.name || 'Guest'}</strong>{review.source && <small>{review.source}</small>}</div></div>
              {Number.isFinite(Number(review.rating)) && <div className="tp-review-card__stars" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(Math.max(0, Math.min(5, Math.round(Number(review.rating)))))}</div>}
              <p>{review.text}</p>
            </article>
          ))}
        </div>
        <div className="tp-reviews-nav">
          <button type="button" onClick={() => slide(-1)} aria-label="Previous reviews"><ChevronLeft size={20} /></button>
          <div className="tp-reviews-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
          <button type="button" onClick={() => slide(1)} aria-label="Next reviews"><ChevronRight size={20} /></button>
        </div>
      </div>
    </section>
  )
}

const GENERAL_FAQS = [
  { question: 'How do I book this experience?', answer: 'Choose your preferred date and guests in the booking form. Our team will then confirm availability and the next steps.' },
  { question: 'When will my booking be confirmed?', answer: 'After your enquiry is submitted, the Tripscape team checks the request and follows up with booking details.' },
  { question: 'Can I request additional services?', answer: 'Yes. Select applicable add-ons in the enquiry form, or contact our team to discuss a customized arrangement.' },
  { question: 'How can I check pickup or meeting details?', answer: 'Pickup and meeting arrangements are confirmed with our team for your selected package.' },
]

function Faqs({ tour, title = '' }) {
  const faqs = asArray(tour.faqs).filter((faq) => faq && faq.question && faq.answer)
  return (
    <section className="tp-faq-section">
      <div className="tp-container">
        <SectionTitle centered kicker="Clear answers, better planning" title={title || 'Frequently Asked Questions'} copy={`Helpful answers before you book ${tour.title}.`} />
        <div className="tp-faq-list">
          {(faqs.length ? faqs : GENERAL_FAQS).map((faq, i) => (
            <details key={`${i}-${faq.question}`}><summary><h3>{faq.question}</h3><span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedTours({ tour }) {
  const related = useMemo(() => {
    const targetCategory = normalize(tour.categoryLabel || tour.category)
    const used = new Set([normalize(tour.title)])
    return tourCatalog.filter((item) => normalize(item.category) === targetCategory && item.image)
      .map(applyTourPricing)
      .filter((item) => { const key = normalize(item.title); if (used.has(key)) return false; used.add(key); return true })
      .slice(0, 3)
  }, [tour.title, tour.category, tour.categoryLabel])
  if (!related.length) return null
  return (
    <section className="tp-related-section">
      <div className="tp-container">
        <div className="tp-title-row"><SectionTitle kicker="More from Tripscape" title="You May Also Love These Adventures" copy="Discover similar experiences selected from our tour collection." /><a className="tp-text-link" href="/tours">View all tours <ArrowRight size={17} /></a></div>
        <div className="tp-related">
          {related.map((item) => (
            <a className="tp-related__card" href={getTourDetailHref(item.category, item.title)} key={item.title}>
              <div className="tp-related__photo"><img src={getTourImages(item.title)?.[0] || item.image} alt={item.title} loading="lazy" /><span>{item.category}</span></div>
              <div className="tp-related__body"><h3>{item.title}</h3><p>{item.description || 'Explore this experience with Tripscape Adventures.'}</p><div><span><small>PRICE</small><strong>{displayPriceOf(item)}</strong></span><span className="tp-related__button">View details <ArrowRight size={15} /></span></div></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function TourDetail({ categorySlug, tourSlug, menuOpen, setMenuOpen, tourOverride = null }) {
  const tour = applyTourPricing(tourOverride || getTourDetail(categorySlug, tourSlug))
  const [lightbox, setLightbox] = useState(null)
  const [heroVideoOk, setHeroVideoOk] = useState(true)
  const reviews = usePublishedReviews()
  const adminImages = useTourImages(tour?.title, tour?.slug || tourSlug)
  // Content written by the SEO team for this page (see seoPages.js), if any.
  const seo = getSeoPage(`/tours/${categorySlug}/${tourSlug}`)
  const seoFaqs = useMemo(() => (seo?.faqs || []), [seo])
  const images = adminImages || orderedImages(tour?.image, tour?.gallery)
  const galleryPhotos = getGalleryPhotos(images)
  const pageRef = useRef(null)

  useEffect(() => {
    setLightbox(null)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [categorySlug, tourSlug])

  useEffect(() => {
    if (!tour) return
    const pagePath = `/tours/${categorySlug}/${tour.slug || tourSlug}`
    const title = seo?.metaTitle || tour.seoTitle || `${tour.title} | Tripscape Tourism`
    const description = seo?.metaDescription || tour.metaDescription || tour.shortDescription || tour.description || ''
    applyMeta({ title, description: description.slice(0, 320), canonical: tour.canonical || pagePath, robots: tour.robots, ogType: 'website' }, pagePath)
    // The schema follows what is on the page: the SEO team's FAQs, meta description and canonical URL.
    writePageSchema(resolveSchema({ ...tour, canonical: canonicalUrl(tour.canonical || pagePath), ...(seo ? { metaDescription: seo.metaDescription, faqs: seoFaqs } : {}) }, 'tour', pagePath))
  }, [tour, categorySlug, tourSlug, seo, seoFaqs])

  useEffect(() => {
    if (lightbox === null || !galleryPhotos.length) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setLightbox(null)
      if (event.key === 'ArrowRight') setLightbox((current) => (current + 1) % galleryPhotos.length)
      if (event.key === 'ArrowLeft') setLightbox((current) => (current - 1 + galleryPhotos.length) % galleryPhotos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [galleryPhotos.length, lightbox])

  if (!tour) return null

  const price = displayPriceOf(tour)
  const category = tour.categoryLabel || tour.category || 'Tours'
  const introCopy = String(tour.description || tour.shortDescription || '').trim()
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi Tripscape, I would like to book ${tour.title}. Please share availability.`)}`
  const heroDescription = seo?.intro || tour.shortDescription || introCopy
  const ctaBook = seo?.heroCtas?.book || 'Book This Experience'
  const ctaWhatsapp = seo?.heroCtas?.whatsapp || 'WhatsApp Assistance'
  return (
    <div className="tp-page" ref={pageRef}>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} variant="light" showTopBar />
      <main>
        <section className="tp-hero">
          {images[0] && <div className="tp-hero__bg" style={{ backgroundImage: `url("${images[0]}")` }} aria-hidden="true" />}
          {heroVideoOk && <HeroVideo src={HERO_VIDEO} poster={images[0]} onError={() => setHeroVideoOk(false)} />}
          <div className="tp-container tp-hero__grid">
            <div className="tp-hero__content">
              <nav className="tp-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/tours">Tours</a><span>/</span><span aria-current="page">{tour.title}</span></nav>
              <div className="tp-hero__pills"><span><Sparkles size={12} /> Tripscape experience</span><span>{category}</span><span>Dubai, UAE</span></div>
              <h1>{seo?.h1 || tour.title}</h1>
              {heroDescription && <p className={`tp-hero__description${seo?.intro ? ' tp-hero__description--full' : ''}`}>{heroDescription}</p>}
              <div className="tp-hero__facts">
                <div><Clock3 size={19} /><span><small>Duration</small><strong>{tour.duration || 'Varies by package'}</strong></span></div>
                <div><MapPin size={19} /><span><small>Location</small><strong>{tour.location || 'Dubai, UAE'}</strong></span></div>
                {tour.rating && <div><Star size={19} fill="currentColor" /><span><small>Guest rating</small><strong>{tour.rating} / 5</strong></span></div>}
                <div><BadgeCheck size={19} /><span><small>Price</small><strong>{price}</strong></span></div>
              </div>
              <div className="tp-hero__actions"><a href="#book" className="tp-button tp-button--gold">{ctaBook} <ArrowRight size={16} /></a><a href={whatsappHref} className="tp-button tp-button--green" target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={17} /> {ctaWhatsapp}</a></div>
              <p className="tp-hero__hint"><ShieldCheck size={14} /> Request your preferred date. Our team will confirm availability.</p>
            </div>
            {images[0] && <HeroPreview tour={tour} images={images} price={price} />}
          </div>
        </section>

        <div className="tp-top-content">
          <div className="tp-container tp-content-grid">
            <div className="tp-main-col">
              <section className="tp-intro-section" aria-label="Experience overview">
                {seo?.sections?.length ? seo.sections.map((section, index) => (
                  <div className="tp-seo-block" key={section.title}>
                    <SectionTitle kicker={index === 0 ? 'Why this experience stands out' : 'Tripscape Adventures'} title={section.title} />
                    <div className="tp-intro__description">{section.paragraphs.map((part) => <p key={part.slice(0, 40)}>{part}</p>)}</div>
                    {section.cta && <a className="tp-button tp-button--gold tp-seo-block__cta" href={section.cta.href}>{section.cta.label}</a>}
                  </div>
                )) : (
                  <>
                    <SectionTitle kicker="Why this experience stands out" title={`Why ${tour.title} is worth experiencing`} />
                    <div className="tp-intro__description">{introCopy ? introCopy.split(/\n\s*\n/).filter(Boolean).map((part, i) => <p key={i}>{part}</p>) : <p>Explore the experience details and contact our team to plan your visit.</p>}</div>
                  </>
                )}
                <IntroHighlights tour={tour} />
              </section>
              <Included tour={tour} />
            </div>
            <aside className="tp-booking-col" aria-label="Reserve your experience">
              <div className="tp-booking-col__sticky" id="book"><BookingEnquiryForm tourTitle={tour.title} displayPrice={price} unit={tour.unit} hideServiceSelector={Boolean(tour.hideServiceSelector)} /></div>
            </aside>
          </div>
          <div className="tp-container"><BookingProcess process={seo?.process || null} /></div>
        </div>

        <ExperienceFlow tour={tour} />
        <Gallery images={images} tour={tour} onOpen={setLightbox} />
        <Comparison tour={tour} />
        <Reviews reviews={reviews} />
        <Faqs tour={seo ? { ...tour, faqs: seoFaqs } : tour} title={seo?.faqsTitle} />
        <RelatedTours tour={tour} />
        <section className="tp-final-cta"><div className="tp-container tp-final-cta__inner"><div><span>READY FOR YOUR NEXT ADVENTURE?</span><h2>Book {tour.title} Today</h2><p>Choose your preferred date or ask our team for help planning your experience.</p></div><div className="tp-final-cta__actions"><a href="#book" className="tp-button tp-button--white">Book This Experience <ArrowRight size={16} /></a><a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="tp-button tp-button--green"><WhatsAppIcon size={17} /> WhatsApp Concierge</a></div></div></section>
      </main>

      {lightbox !== null && galleryPhotos[lightbox] && <div className="tp-lightbox" role="dialog" aria-modal="true" aria-label={`${tour.title} image gallery`} onClick={() => setLightbox(null)}><button type="button" className="tp-lightbox__close" onClick={() => setLightbox(null)} aria-label="Close gallery"><X size={23} /></button>{galleryPhotos.length > 1 && <button type="button" className="tp-lightbox__previous" onClick={(event) => { event.stopPropagation(); setLightbox((lightbox - 1 + galleryPhotos.length) % galleryPhotos.length) }} aria-label="Previous photo"><ChevronLeft size={27} /></button>}<img src={galleryPhotos[lightbox]} alt={`${tour.title} photo ${lightbox + 1}`} onClick={(event) => event.stopPropagation()} />{galleryPhotos.length > 1 && <button type="button" className="tp-lightbox__next" onClick={(event) => { event.stopPropagation(); setLightbox((lightbox + 1) % galleryPhotos.length) }} aria-label="Next photo"><ChevronRight size={27} /></button>}<span className="tp-lightbox__count">{lightbox + 1} / {galleryPhotos.length}</span></div>}
      <Footer />
      <CallFloat />
      <WhatsAppFloat />
    </div>
  )
}
