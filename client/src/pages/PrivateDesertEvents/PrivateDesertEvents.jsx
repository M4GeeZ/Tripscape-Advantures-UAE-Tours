import { useEffect, useRef } from 'react'
import { ArrowRight, Check, MessageCircle, Phone, Users } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import CallFloat from '../../components/CallFloat/CallFloat'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import { useLuxuryReveal } from '../../hooks/useLuxuryReveal'
import { privateEventExperiences } from '../../privateEventExperiences'
import { getTourDetailHref } from '../../tourDetails'
import './PrivateDesertEvents.css'

const FAMILY_HIGHLIGHTS = [
  'Private setup designed for up to 6 guests',
  'Family and small-group friendly',
  'Reserved seating and dedicated guest support',
  'Dinner and transfer options available',
  'Custom celebration requests can be quoted',
  'Direct WhatsApp planning before the event'
]

export default function PrivateDesertEvents({ menuOpen, setMenuOpen }) {
  const pageRef = useRef(null)
  useLuxuryReveal(pageRef)

  useEffect(() => {
    document.title = 'VIP Private Desert Safari | Family & Event Packages'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="private-events-page" ref={pageRef}>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} variant="light" showTopBar />

      <main>
        <section className="private-events-hero">
          <div className="private-events-hero__image" aria-hidden="true" />
          <div className="private-events-hero__overlay" />
          <div className="container private-events-hero__content">
            <span className="private-events-eyebrow" data-hero-reveal>VIP PRIVATE DESERT SAFARI</span>
            <h1 data-hero-reveal>THE DESERT DREAMSCAPE</h1>
            <p data-hero-reveal>
              ULTRA ROMANTIC PRIVATE SETUP — A flexible private desert experience for families, couples and celebrations.
            </p>
            <div className="private-events-hero__actions" data-hero-reveal>
              <a className="private-events-primary" href="#event-packages">Book now</a>
              <a className="private-events-secondary" href="https://wa.me/971549930684?text=Hi%20Tripscape%2C%20I%20want%20to%20plan%20a%20VIP%20private%20desert%20event." target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> WhatsApp</a>
              <a className="private-events-secondary" href="tel:+971549930684"><Phone size={18} /> Call now</a>
            </div>
          </div>
        </section>

        <section className="private-events-family section">
          <div className="container private-events-family__grid">
            <div data-lux-reveal>
              <span className="private-events-kicker">FAMILY PACKAGE</span>
              <h2>Private desert setup for up to 6 guests.</h2>
              <p>
                Ideal for families and small private groups who want a more personal desert experience with reserved seating, dedicated service and the option to add a celebration setup.
              </p>
            </div>
            <ul className="private-events-highlights" data-lux-reveal>
              {FAMILY_HIGHLIGHTS.map((item) => <li key={item}><Check size={17} /><span>{item}</span></li>)}
            </ul>
          </div>
        </section>

        <section id="event-packages" className="private-events-packages section">
          <div className="container">
            <div className="private-events-heading" data-lux-reveal>
              <span className="private-events-kicker">CHOOSE YOUR EVENT</span>
              <h2>Six private desert event experiences.</h2>
              <p>Open any event to see its dedicated detail page, inclusions, exclusions and FAQs.</p>
            </div>

            <div className="private-events-grid">
              {privateEventExperiences.map((event) => {
                const href = getTourDetailHref('Desert Safari', event.title)
                return (
                  <article className="private-event-card" key={event.title} data-lux-reveal>
                    <a className="private-event-card__image" href={href} aria-label={`View ${event.title}`}>
                      <img src={event.image} alt={event.title} loading="lazy" />
                      <span>{event.meta}</span>
                    </a>
                    <div className="private-event-card__body">
                      <div className="private-event-card__meta"><Users size={15} /> Private event</div>
                      <h3><a href={href}>{event.title}</a></h3>
                      <p>{event.description}</p>
                      <div className="private-event-card__footer">
                        <strong>Contact for price</strong>
                        <a href={href}>View Page <ArrowRight size={16} /></a>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="private-events-final section">
          <div className="container private-events-final__inner" data-lux-reveal>
            <div>
              <span className="private-events-kicker">CUSTOM REQUEST?</span>
              <h2>Tell us the date, occasion and guest count.</h2>
              <p>We’ll confirm the available setup and provide a tailored quote on WhatsApp.</p>
            </div>
            <a href="https://wa.me/971549930684?text=Hi%20Tripscape%2C%20I%20want%20a%20quote%20for%20a%20private%20desert%20event." target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> Get a quote</a>
          </div>
        </section>
      </main>

      <Footer />
      <CallFloat />
      <WhatsAppFloat />
    </div>
  )
}
