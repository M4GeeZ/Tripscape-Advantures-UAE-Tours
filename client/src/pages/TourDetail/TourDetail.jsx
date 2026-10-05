import { useEffect, useRef, useState } from 'react'
import { Check, Clock3, MapPin, MessageCircle, Minus, Plus, Star, X } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
import BookingEnquiryForm from '../../components/BookingEnquiryForm'
import { useLuxuryReveal } from '../../hooks/useLuxuryReveal'
import { getTourDetail } from '../../tourDetails'
import './TourDetail.css'

function getTomorrowDate() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getTodayDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function TourDetail({ categorySlug, tourSlug, menuOpen, setMenuOpen, tourOverride = null }) {
  const pageRef = useRef(null)
  const tour = tourOverride || getTourDetail(categorySlug, tourSlug)
  const [activeImage, setActiveImage] = useState(0)
  const [travelDate, setTravelDate] = useState(getTomorrowDate)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)

  useLuxuryReveal(pageRef)

  useEffect(() => {
    setActiveImage(0)
    setTravelDate(getTomorrowDate())
    setAdults(1)
    setChildren(0)
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
  }, [tour, categorySlug, tourSlug])

  if (!tour) return null

  const gallery = tour.gallery?.length ? tour.gallery : [tour.image]
  const totalPrice = tour.isBookable ? tour.basePrice * adults : 0


  const bookingMessage = [
    `Hi Tripscape, I would like to book: ${tour.title}`,
    `Travel date: ${travelDate}`,
    `Adults: ${adults}`,
    `Children: ${children} (Free)`,
    `Total estimate: AED ${totalPrice}`
  ].join('\n')

  const bookingWhatsappHref = tour.isBookable
    ? `https://wa.me/971549930684?text=${encodeURIComponent(bookingMessage)}`
    : '#'

  const displayContactPrice = /(?:from\s*)?aed\s*0/i.test(String(tour.price || ''))
    ? 'Contact for price'
    : tour.price

  return (
    <div className="tour-detail-page" ref={pageRef}>
      <Navbar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        variant="light"
        showTopBar
      />

      <main>
        <section className="tour-detail-gallery" data-hero-reveal>
          <div className="tour-detail-gallery__stage">
            <img
              key={gallery[activeImage]}
              src={gallery[activeImage]}
              alt={`${tour.title} view ${activeImage + 1}`}
              className="tour-detail-gallery__hero"
            />

            {gallery.length > 1 && (
              <div className="tour-detail-gallery__dots" aria-label="Tour gallery position">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={index === activeImage ? 'is-active' : ''}
                    aria-label={`Show image ${index + 1}`}
                    onClick={() => setActiveImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="container tour-detail-gallery__thumbs" data-hero-reveal>
            {gallery.map((image, index) => (
              <button
                key={`${image}-thumb-${index}`}
                type="button"
                className={`tour-detail-thumb ${index === activeImage ? 'is-active' : ''}`}
                onClick={() => setActiveImage(index)}
                aria-label={`View ${tour.title} image ${index + 1}`}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </section>

       <section className="tour-detail-content">
  <div className="container tour-detail-content__grid has-enquiry-form">
            <div className="tour-detail-main">
              <span className="tour-detail-badge" data-lux-reveal>
                {tour.categoryLabel}
              </span>

              <h1 data-lux-reveal>{tour.title}</h1>

              <div className="tour-detail-meta" data-lux-reveal>
                <span className="tour-detail-rating">
                  <Star size={15} fill="currentColor" />
                  {tour.rating} · {tour.reviews} reviews
                </span>

                <span>
                  <Clock3 size={15} />
                  {tour.duration}
                </span>

                <span>
                  <MapPin size={15} />
                  {tour.location}
                </span>
              </div>

              {tour.description && (
                <div className="tour-detail-description-block" data-lux-reveal>
                  <h2>Description</h2>
                  <p className="tour-detail-description">{tour.description}</p>
                </div>
              )}

              <div className="tour-detail-included" data-lux-reveal>
                <h2>What's included</h2>

                <ul>
                  {tour.included.map((item) => (
                    <li key={item}>
                      <Check size={17} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="tour-detail-excluded" data-lux-reveal>
                <h2>What's excluded</h2>
                <ul>
                  {tour.excluded.map((item) => (
                    <li key={item}>
                      <X size={17} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="tour-detail-faqs" data-lux-reveal>
                <h2>Frequently asked questions</h2>
                <div className="tour-detail-faqs__list">
                  {tour.faqs.map((faq, index) => (
                    <details key={faq.question} open={index === 0}>
                      <summary>{faq.question}</summary>
                      <p>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>

           <BookingEnquiryForm
  tourTitle={tour.title}
  displayPrice={displayContactPrice}
  hideServiceSelector={Boolean(tour.hideServiceSelector)}
/>
          </div>
        </section>
      </main>

      <Footer />
      <CallFloat />
      <WhatsAppFloat />
    </div>
  )
}
