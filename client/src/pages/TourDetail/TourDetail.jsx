import { useEffect, useMemo, useRef, useState } from 'react'
import { BadgeCheck, CalendarCheck, ChevronLeft, ChevronRight, Headphones, MessageCircle, RefreshCcw, Star, X } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
import BookingEnquiryForm from '../../components/BookingEnquiryForm'
import { useLuxuryReveal } from '../../hooks/useLuxuryReveal'
import { tourCatalog } from '../../data'
import { getTourDetail, getTourDetailHref } from '../../tourDetails'
import { apiUrl } from '../../utils/apiBaseUrl'
import { isDisplayableReview } from '../../utils/reviews'
import { MAX_TOUR_IMAGES, getTourImages, orderedImages, useTourImages } from '../../utils/tourImages'
import './TourDetail.css'
import './TourDetailPage.css'
import { applyTourPricing } from '../../utils/tourPricing'
import { resolveSchema, writePageSchema } from '../../utils/schemaManager'

const WHATSAPP_NUMBER = '971549930684'

// Same promises the site already makes on the home page.
const TRUST_ITEMS = [
  { icon: BadgeCheck, title: 'Verified guides', copy: 'Experienced local team' },
  { icon: CalendarCheck, title: 'Instant confirmation', copy: 'Booking details by email' },
  { icon: Headphones, title: 'WhatsApp support', copy: 'Fast replies before your trip' },
  { icon: RefreshCcw, title: 'Free re-scheduling', copy: 'Change dates on WhatsApp' },
]

// How booking works on this site (the enquiry form → team confirms → trip).
const BOOKING_STEPS = [
  { title: 'Send your request', copy: 'Choose your date, guests and add-ons in the booking form below.' },
  { title: 'We confirm', copy: 'Our team checks availability and confirms the details by email or WhatsApp.' },
  { title: 'Pickup details', copy: 'You receive pickup timing and everything you need before the day.' },
  { title: 'Enjoy the experience', copy: 'Relax — our local team takes care of the rest on the day.' },
]

function SectionHead({ eyebrow, title, copy, align = 'center' }) {
  return (
    <div className={`td-head td-head--${align}`}>
      <span className="td-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  )
}

const splitSentences = (text = '') => String(text).match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g)?.map((item) => item.trim()) || []

// Splits a description into short readable paragraphs (two sentences each).
function toParagraphs(text = '') {
  const sentences = splitSentences(text)
  const paragraphs = []
  for (let index = 0; index < sentences.length; index += 2) paragraphs.push(sentences.slice(index, index + 2).join(' '))
  return paragraphs
}

const normalize = (text) => String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

function useFeaturedReview() {
  const [review, setReview] = useState(null)
  useEffect(() => {
    let active = true
    fetch(apiUrl('/api/reviews'))
      .then((res) => (res.ok ? res.json() : []))
      .then((items) => {
        const best = (Array.isArray(items) ? items : []).filter((item) => Number(item.rating) >= 5 && isDisplayableReview(item))
        if (active && best.length) setReview(best[Math.floor(Math.random() * best.length)])
      })
      .catch(() => {})
    return () => { active = false }
  }, [])
  return review
}

export default function TourDetail({ categorySlug, tourSlug, menuOpen, setMenuOpen, tourOverride = null }) {
  const pageRef = useRef(null)
  const tour = applyTourPricing(tourOverride || getTourDetail(categorySlug, tourSlug))
  const [lightbox, setLightbox] = useState(null)
  const review = useFeaturedReview()

  useLuxuryReveal(pageRef)

  useEffect(() => {
    setLightbox(null)
    window.scrollTo(0, 0)
  }, [categorySlug, tourSlug])

  useEffect(() => {
    if (!tour) return
    const title = tour.seoTitle || `${tour.title} | Tripscape Tourism`
    const description = tour.metaDescription || tour.shortDescription || tour.description || ''
    document.title = title
    const meta = document.querySelector('meta[name="description"]')
    if (meta && description) meta.setAttribute('content', description.slice(0, 320))
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = tour.canonical || `${window.location.origin}/tours/${categorySlug}/${tour.slug || tourSlug}`
    let robots = document.querySelector('meta[name="robots"]')
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots) }
    robots.content = tour.robots || 'index,follow'
    writePageSchema(resolveSchema(tour, 'tour', `/tours/${categorySlug}/${tour.slug || tourSlug}`))
  }, [tour, categorySlug, tourSlug])

  // Photos from the admin panel in order: 1 = hero + cards, 2 = intro, 3–10 = gallery.
  const adminImages = useTourImages(tour?.title, tour?.slug || tourSlug)
  const gallery = adminImages || orderedImages(tour?.image, tour?.gallery)
  // Images 1 and 2 are already shown in the hero and intro, so the gallery starts at image 3.
  const galleryPhotos = gallery.slice(2, MAX_TOUR_IMAGES)

  // Other tours from the same category for "You may also love".
  const related = useMemo(() => {
    if (!tour) return []
    const seen = new Set([normalize(tour.title)])
    return tourCatalog
      .filter((item) => item.category === (tour.categoryLabel || tour.category) && item.image)
      .map(applyTourPricing)
      .filter((item) => {
        const key = normalize(item.title)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .slice(0, 3)
  }, [tour?.title, tour?.categoryLabel, tour?.category])

  // Lightbox keyboard controls.
  useEffect(() => {
    if (lightbox === null) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setLightbox(null)
      if (event.key === 'ArrowRight') setLightbox((index) => (index + 1) % galleryPhotos.length)
      if (event.key === 'ArrowLeft') setLightbox((index) => (index - 1 + galleryPhotos.length) % galleryPhotos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, galleryPhotos.length])

  if (!tour) return null

  const displayContactPrice = /^(|contact.*|(from\s*)?aed\s*0)$/i.test(String(tour.price || '').trim())
    ? 'Contact for price'
    : tour.price
  const hasPrice = displayContactPrice !== 'Contact for price'
  const paragraphs = toParagraphs(tour.description)
  const subtitle = tour.shortDescription || paragraphs[0] || ''
  const introImage = gallery[1] || gallery[0]
  const categoryLabel = tour.categoryLabel || tour.category || 'Experience'
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi Tripscape, I would like to book ${tour.title}. Please share availability.`)}`

  const scrollToBooking = (event) => {
    event.preventDefault()
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="tour-detail-page td-page" ref={pageRef}>
      <Navbar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        variant="light"
        showTopBar
      />

      <main>
        {/* ============ HERO ============ */}
        <section className="td-hero" data-hero-reveal>
          <div className="td-hero__bg" style={{ backgroundImage: `url("${gallery[0]}")` }} />
          <div className="td-hero__overlay" aria-hidden="true" />

          <div className="td-hero__inner">
            <div className="td-hero__content">
              <nav className="td-breadcrumb" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <a href={`/tours?category=${encodeURIComponent(categoryLabel)}`}>{categoryLabel}</a>
                <span>/</span>
                <span aria-current="page">{tour.title}</span>
              </nav>

              <p className="td-hero__eyebrow">{categoryLabel} • Dubai</p>
              <h1>{tour.title}</h1>
              {subtitle && <p className="td-hero__sub">{subtitle}</p>}

              <div className="td-hero__cta">
                <a href="#book" className="td-btn td-btn--gold" onClick={scrollToBooking}>Book This Experience</a>
                <a href={whatsappHref} className="td-btn td-btn--outline-light" target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> WhatsApp Us</a>
              </div>

              <dl className="td-hero__meta">
                <div>
                  <dt>Duration</dt>
                  <dd>{tour.duration || 'Flexible'}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{tour.location || 'Dubai, UAE'}</dd>
                </div>
                <div>
                  <dt>Rating</dt>
                  <dd>{tour.rating || '4.9'} <Star size={15} fill="currentColor" /></dd>
                </div>
                <div>
                  <dt>From</dt>
                  <dd>{displayContactPrice}{hasPrice && tour.unit ? ` ${tour.unit}` : ''}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ============ INTRO ============ */}
        <section className="td-intro">
          <div className="container td-intro__grid">
            <div className="td-intro__image" data-lux-reveal>
              <img src={introImage} alt={tour.title} loading="lazy" />
            </div>
            <div className="td-intro__text" data-lux-reveal>
              <span className="td-eyebrow">The {categoryLabel} experience</span>
              <h2>{tour.title}</h2>
              {(paragraphs.length ? paragraphs : [subtitle]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <a href="#book" className="td-btn-text" onClick={scrollToBooking}>Reserve this experience</a>
            </div>
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section className="td-steps">
          <div className="container">
            <SectionHead eyebrow="How it works" title="From booking to the desert." copy="Simple, clear and handled by our local team at every step." />
            <div className="td-steps__grid">
              {BOOKING_STEPS.map((step, index) => (
                <div className="td-step" key={step.title} data-lux-reveal>
                  <span className="td-step__num">{String(index + 1).padStart(2, '0')}</span>
                  <h4>{step.title}</h4>
                  <p>{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ INCLUDED ============ */}
        <section className="td-included">
          <div className="container td-included__grid">
            <div className="td-included__text" data-lux-reveal>
              <span className="td-eyebrow">What's included</span>
              <h2>Everything included in your booking.</h2>
              <p>Every detail below is part of {tour.title}. Anything not listed can be arranged on request.</p>
              <a href="#book" className="td-btn-text" onClick={scrollToBooking}>Check availability</a>
            </div>

            <div data-lux-reveal>
              <h3 className="td-excluded__title td-included__title">Included</h3>
              <ul className="td-included__list">
                {(tour.included || []).map((item) => <li key={item}><span>✓</span>{item}</li>)}
              </ul>

              {tour.excluded?.length > 0 && (
                <>
                  <h3 className="td-excluded__title">Not included</h3>
                  <ul className="td-included__list td-included__list--excluded">
                    {tour.excluded.map((item) => <li key={item}><span>✕</span>{item}</li>)}
                  </ul>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ============ GALLERY ============ */}
        {galleryPhotos.length > 0 && (
          <section className="td-gallery-section">
            <div className="container">
              <SectionHead eyebrow="Gallery" title="Moments worth remembering." />
              <div className={`td-gallery ${galleryPhotos.length > 6 ? 'td-gallery--four' : ''}`}>
                {galleryPhotos.map((image, index) => (
                  <button key={`${image}-${index}`} type="button" onClick={() => setLightbox(index)} aria-label={`Open image ${index + 1}`} data-lux-reveal>
                    <img src={image} alt={`${tour.title} ${index + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============ TRUST STRIP ============ */}
        <section className="td-trust">
          <div className="container td-trust__grid">
            {TRUST_ITEMS.map(({ icon: Icon, title, copy }) => (
              <div className="td-trust__item" key={title}>
                <span><Icon size={20} /></span>
                <div>
                  <strong>{title}</strong>
                  <small>{copy}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ PRICE + BOOKING ============ */}
        <section className="td-book" id="book">
          <div className="container">
            <SectionHead eyebrow="Book your experience" title="Reserve your date." copy="Send your request now — no payment is needed to book an enquiry." />

            <div className="td-book__wide">
              <div className="td-book__form">
                <BookingEnquiryForm
                  tourTitle={tour.title}
                  displayPrice={displayContactPrice}
                  hideServiceSelector={Boolean(tour.hideServiceSelector)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        {tour.faqs?.length > 0 && (
          <section className="td-faq">
            <div className="container">
              <SectionHead eyebrow="FAQ" title={`Questions about ${tour.title}.`} />
              <div className="td-faq__list">
                {tour.faqs.map((faq, index) => (
                  <details key={faq.question} open={index === 0}>
                    <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============ GUEST REVIEW (published reviews only) ============ */}
        {review && (
          <section className="td-review">
            <div className="container td-review__inner" data-lux-reveal>
              <span className="td-review__quote-icon" aria-hidden="true">“</span>
              <div className="td-review__stars" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(Math.round(review.rating))}</div>
              <p className="td-review__quote">{review.text}</p>
              <div className="td-review__author">
                <span className="td-review__avatar">{review.name.charAt(0)}</span>
                <span className="td-review__name">{review.name}{review.source && <small>{review.source} review</small>}</span>
              </div>
            </div>
          </section>
        )}

        {/* ============ RELATED ============ */}
        {related.length > 0 && (
          <section className="td-related">
            <div className="container">
              <SectionHead eyebrow="Explore more" title="You may also love these." copy={`More ${categoryLabel.toLowerCase()} experiences from Tripscape.`} />
              <div className="td-related__grid">
                {related.map((item) => (
                  <a key={item.title} href={getTourDetailHref(item.category, item.title)} className="td-related__card" data-lux-reveal>
                    <div className="td-related__image"><img src={getTourImages(item.title)?.[0] || item.image} alt={item.title} loading="lazy" /></div>
                    <div className="td-related__body">
                      <span className="td-related__category">{item.category}</span>
                      <h3>{item.title}</h3>
                      <p>{item.price ? `From ${item.price}${item.unit ? ` ${item.unit}` : ''}` : 'Contact for price'}</p>
                      <span className="td-related__link">View experience</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============ FINAL CTA ============ */}
        <section className="td-final-cta">
          <div className="td-final-cta__bg" style={{ backgroundImage: `url("${gallery[0]}")` }} />
          <div className="td-final-cta__overlay" aria-hidden="true" />
          <div className="container td-final-cta__content" data-lux-reveal>
            <span className="td-eyebrow td-eyebrow--light">Ready when you are</span>
            <h2>Book {tour.title} today.</h2>
            <p>Send your request in a minute, or chat with our team on WhatsApp for availability and custom plans.</p>
            <div className="td-hero__cta td-hero__cta--center">
              <a href="#book" className="td-btn td-btn--gold" onClick={scrollToBooking}>Book This Experience</a>
              <a href={whatsappHref} className="td-btn td-btn--outline-light" target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> WhatsApp Us</a>
            </div>
          </div>
        </section>
      </main>

      {lightbox !== null && (
        <div className="td-lightbox" role="dialog" aria-modal="true" aria-label={`${tour.title} gallery`} onClick={() => setLightbox(null)}>
          <button type="button" className="td-lightbox__close" onClick={() => setLightbox(null)} aria-label="Close gallery"><X size={22} /></button>
          {galleryPhotos.length > 1 && (
            <button type="button" className="td-lightbox__nav td-lightbox__nav--prev" onClick={(event) => { event.stopPropagation(); setLightbox((lightbox - 1 + galleryPhotos.length) % galleryPhotos.length) }} aria-label="Previous image"><ChevronLeft size={26} /></button>
          )}
          <img src={galleryPhotos[lightbox]} alt={`${tour.title} ${lightbox + 1}`} onClick={(event) => event.stopPropagation()} />
          {galleryPhotos.length > 1 && (
            <button type="button" className="td-lightbox__nav td-lightbox__nav--next" onClick={(event) => { event.stopPropagation(); setLightbox((lightbox + 1) % galleryPhotos.length) }} aria-label="Next image"><ChevronRight size={26} /></button>
          )}
          <span className="td-lightbox__count">{lightbox + 1} / {galleryPhotos.length}</span>
        </div>
      )}

      <Footer />
      <CallFloat />
      <WhatsAppFloat />
    </div>
  )
}
