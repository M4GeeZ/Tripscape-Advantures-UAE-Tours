import { useEffect, useRef, useState } from 'react'
import { Check, Clock3, MapPin, MessageCircle, Minus, Plus, Star, X } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
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

export default function TourDetail({ categorySlug, tourSlug, menuOpen, setMenuOpen }) {
  const pageRef = useRef(null)
  const tour = getTourDetail(categorySlug, tourSlug)
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

  if (!tour) return null

  const gallery = tour.gallery?.length ? tour.gallery : [tour.image]
  const totalPrice = tour.isBookable ? tour.basePrice * adults : 0

  const whatsappText = encodeURIComponent(`Hi Tripscape, I would like to ask about: ${tour.title}`)
  const whatsappHref = `https://wa.me/971549930684?text=${whatsappText}`

  const bookingMessage = [
    `Hi Tripscape, I would like to book: ${tour.title}`,
    `Travel date: ${travelDate}`,
    `Adults: ${adults}`,
    `Children: ${children} (Free)`,
    `Total estimate: AED ${totalPrice}`
  ].join('\n')

  const bookingWhatsappHref = tour.isBookable
    ? `https://wa.me/971549930684?text=${encodeURIComponent(bookingMessage)}`
    : whatsappHref

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

        <section className={`tour-detail-content ${tour.isBookable ? 'is-bookable-tour' : ''}`}>
          <div className="container tour-detail-content__grid">
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

            {tour.isBookable ? (
              <aside className="tour-booking-card" data-lux-reveal>
                <div className="tour-booking-price">
                  <span>PRICE PER PERSON</span>
                  <div>
                    <strong>AED {tour.basePrice}</strong>
                    <small>adult</small>
                  </div>
                </div>

                <label className="tour-booking-date">
                  <span>TRAVEL DATE</span>
                  <input
                    type="date"
                    min={getTodayDate()}
                    value={travelDate}
                    onChange={(event) => setTravelDate(event.target.value)}
                  />
                </label>

                <div className="tour-booking-counters">
                  <div className="tour-booking-counter">
                    <span className="tour-booking-counter__label">ADULTS</span>
                    <div className="tour-booking-counter__controls">
                      <button
                        type="button"
                        aria-label="Decrease adults"
                        onClick={() => setAdults((value) => Math.max(1, value - 1))}
                        disabled={adults <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <strong>{adults}</strong>
                      <button
                        type="button"
                        aria-label="Increase adults"
                        onClick={() => setAdults((value) => value + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="tour-booking-counter">
                    <span className="tour-booking-counter__label">CHILDREN</span>
                    <div className="tour-booking-counter__controls">
                      <button
                        type="button"
                        aria-label="Decrease children"
                        onClick={() => setChildren((value) => Math.max(0, value - 1))}
                        disabled={children <= 0}
                      >
                        <Minus size={16} />
                      </button>
                      <strong>{children}</strong>
                      <button
                        type="button"
                        aria-label="Increase children"
                        onClick={() => setChildren((value) => value + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="tour-booking-child-note">Children are free in this price calculator.</p>

                <div className="tour-booking-total">
                  <span>Total estimate ({adults} adult{adults === 1 ? '' : 's'})</span>
                  <strong>AED {totalPrice}</strong>
                </div>

                <a
                  href={bookingWhatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tour-booking-continue"
                >
                  Continue to book
                </a>

                <a
                  href={bookingWhatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tour-booking-whatsapp"
                >
                  <MessageCircle size={17} />
                  Chat on WhatsApp
                </a>

                <ul className="tour-booking-benefits">
                  <li><Check size={14} /> No booking fee</li>
                  <li><Check size={14} /> Free cancellation 24hrs before</li>
                  <li><Check size={14} /> 24/7 WhatsApp support</li>
                </ul>
              </aside>
            ) : (
              <aside className="tour-detail-price-card" data-lux-reveal>
                <span>PRICE</span>
                <strong>{displayContactPrice}</strong>
                <p>Contact our team for availability and the current rate.</p>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tour-detail-whatsapp"
                >
                  <MessageCircle size={18} />
                  Ask on WhatsApp
                </a>
              </aside>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <CallFloat />
      <WhatsAppFloat />
    </div>
  )
}
