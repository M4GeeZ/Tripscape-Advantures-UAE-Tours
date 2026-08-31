import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronRight, Clock3, MapPin, MessageCircle, Phone, ShieldCheck, Star, X } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
import CountryCodeSelect from '../../components/CountryCodeSelect/CountryCodeSelect'
import ReviewsSection from '../../components/ReviewsSection/ReviewsSection'
import { useLuxuryReveal } from '../../hooks/useLuxuryReveal'
import { getCampaignPage } from '../../campaignPages'
import { getTourDetailHref } from '../../tourDetails'
import './CampaignLanding.css'

const PHONE = '+971549930684'
const WHATSAPP = '971549930684'

function tomorrow() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

function CampaignPackageCard({ tour, campaignTitle }) {
  const href = getTourDetailHref(tour.category, tour.title)
  const contactPrice = /contact|aed\s*0/i.test(String(tour.price || ''))
  return (
    <article className="ad-package-card" data-lux-reveal>
      <a className="ad-package-card__image" href={href}>
        <img src={tour.image} alt={tour.title} loading="lazy" />
        {tour.duration && <span><Clock3 size={14} /> {tour.duration}</span>}
      </a>
      <div className="ad-package-card__body">
        <div className="ad-package-card__rating"><Star size={14} fill="currentColor" /> 4.9 rating</div>
        <h3>{tour.title}</h3>
        <ul>
          <li><Check size={15} /> Campaign-relevant package</li>
          <li><Check size={15} /> Direct booking support</li>
          <li><Check size={15} /> Clear package confirmation</li>
        </ul>
        <div className="ad-package-card__price">
          <small>{contactPrice ? 'PRICE' : 'FROM'}</small>
          <strong>{contactPrice ? 'Contact for price' : tour.price}</strong>
          {tour.unit && !contactPrice && <span>{tour.unit}</span>}
        </div>
        <div className="ad-package-card__actions">
          <a className="ad-package-card__whatsapp" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Tripscape, I am interested in ${tour.title} from the ${campaignTitle} campaign.`)}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a>
          <a className="ad-package-card__view" href={href}>View package <ChevronRight size={17} /></a>
        </div>
      </div>
    </article>
  )
}

function BookingForm({ page }) {
  const [form, setForm] = useState({
    package: page.tours[0]?.title || '',
    date: tomorrow(),
    adults: '2',
    children: '0',
    age: '',
    name: '',
    email: '',
    countryCode: '+971',
    phone: '',
    hasWhatsApp: true,
    pickup: '',
    notes: ''
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setForm((current) => ({ ...current, package: page.tours[0]?.title || '', date: tomorrow() }))
  }, [page])

  const update = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const fullPhone = `${form.countryCode} ${form.phone}`.trim()

  const whatsappHref = useMemo(() => {
    const message = [
      `Hi Tripscape, I want to book from the ${page.title} campaign.`,
      `Package: ${form.package || 'Please advise'}`,
      `Date: ${form.date}`,
      `Adults: ${form.adults}`,
      `Children: ${form.children}`,
      `Name: ${form.name || '-'}`,
      `Age: ${form.age || '-'}`,
      `Email: ${form.email || '-'}`,
      `Country code: ${form.countryCode || '-'}`,
      `Phone: ${form.phone ? fullPhone : '-'}`,
      `Pickup/Hotel: ${form.pickup || '-'}`,
      `Notes: ${form.notes || '-'}`
    ].join('\n')
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`
  }, [form, fullPhone, page.title])

  const submit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    setSubmitting(true)
    const whatsappWindow = form.hasWhatsApp ? window.open('', '_blank') : null

    try {
      const selectedTour = page.tours.find((tour) => tour.title === form.package)
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourTitle: form.package || page.title,
          price: selectedTour?.price || 'Contact for price',
          name: form.name,
          age: form.age,
          adults: form.adults,
          children: form.children,
          email: form.email,
          countryCode: form.countryCode,
          phone: form.phone,
          travelDate: form.date,
          hasWhatsApp: form.hasWhatsApp,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to send booking enquiry right now.')

      setStatus({
        type: 'success',
        message: form.hasWhatsApp
          ? (data.whatsappConfirmation === 'sent'
            ? `Enquiry ${data.bookingReference || ''} sent. Email and WhatsApp confirmation sent.`
            : `Enquiry ${data.bookingReference || ''} sent. Email confirmation sent; WhatsApp is opening for your message.`)
          : `Enquiry ${data.bookingReference || ''} sent by email. Please check your inbox.`,
      })

      if (form.hasWhatsApp && whatsappWindow) whatsappWindow.location.href = whatsappHref
    } catch (error) {
      if (whatsappWindow) whatsappWindow.close()
      setStatus({ type: 'error', message: error.message || 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="ad-booking-form" onSubmit={submit} id="booking-form" data-lux-reveal>
      <div className="ad-booking-form__head">
        <span>BOOK THIS EXPERIENCE</span>
        <h2>Check availability</h2>
        <p>Submit your booking enquiry. We will email your confirmation and open WhatsApp when selected.</p>
      </div>
      <label className="ad-field ad-field--full"><span>Package</span><select name="package" value={form.package} onChange={update}>{page.tours.map((tour) => <option key={tour.title} value={tour.title}>{tour.title}</option>)}</select></label>
      <label className="ad-field"><span>Travel date</span><input type="date" name="date" value={form.date} onChange={update} required /></label>
      <label className="ad-field"><span>Age</span><input type="number" min="1" max="100" name="age" value={form.age} onChange={update} placeholder="Age" required /></label>
      <label className="ad-field"><span>Adults</span><input type="number" min="1" name="adults" value={form.adults} onChange={update} required /></label>
      <label className="ad-field"><span>Children</span><input type="number" min="0" name="children" value={form.children} onChange={update} /></label>
      <label className="ad-field"><span>Name</span><input type="text" name="name" value={form.name} onChange={update} placeholder="Your name" required /></label>
      <label className="ad-field"><span>Email</span><input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" required /></label>
      <div className="ad-field"><span>Country code</span><CountryCodeSelect value={form.countryCode} onChange={(countryCode) => setForm((current) => ({ ...current, countryCode }))} /></div>
      <label className="ad-field"><span>Phone number</span><input type="tel" name="phone" value={form.phone} onChange={update} placeholder="50 123 4567" required /></label>
      <label className="ad-field"><span>Pickup / hotel</span><input type="text" name="pickup" value={form.pickup} onChange={update} placeholder="Hotel or area" /></label>
      <label className="ad-field ad-field--full"><span>Notes</span><textarea name="notes" rows="3" value={form.notes} onChange={update} placeholder="Any timing, celebration or package request" /></label>
      <label className="ad-field ad-field--full ad-whatsapp-check"><input type="checkbox" name="hasWhatsApp" checked={form.hasWhatsApp} onChange={update} /><span>This phone number has WhatsApp</span></label>
      {status.message && <div className={`ad-booking-status is-${status.type}`}>{status.message}</div>}
      <button type="submit" disabled={submitting} className="ad-booking-submit"><MessageCircle size={18} /> {submitting ? 'Sending...' : 'Book Enquiry Now'}</button>
      <a className="ad-booking-call" href={`tel:${PHONE}`}><Phone size={17} /> Call +971 54 993 0684</a>
    </form>
  )
}

export default function CampaignLanding({ slug, menuOpen, setMenuOpen }) {
  const pageRef = useRef(null)
  const page = getCampaignPage(slug)
  useLuxuryReveal(pageRef)

  useEffect(() => {
    if (!page) return
    window.scrollTo(0, 0)
    document.title = page.seoTitle
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = page.seoDescription
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${window.location.origin}${page.slug === 'evening-desert-safari' ? '/tours/desert-safari' : `/tours/${page.slug}`}`
  }, [page])

  if (!page) return null

  const whatsappIntro = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Tripscape, I am interested in ${page.title}. Please share availability.`)}`

  return (
    <div className="ad-landing-page" ref={pageRef}>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} variant="overlay" />
      <main>
        <section className="ad-hero" style={{ '--ad-hero-image': `url(${page.heroImage})` }}>
          <div className="ad-hero__overlay" />
          <div className="container ad-hero__content">
            <span className="ad-eyebrow">{page.eyebrow}</span>
            <h1>{page.title}</h1>
            <p>{page.heroCopy}</p>
            <div className="ad-hero__trust"><span><ShieldCheck size={17} /> UAE booking support</span><span><Star size={16} fill="currentColor" /> 4.9 guest rating</span></div>
            <div className="ad-hero__actions">
              <a className="ad-btn ad-btn--gold" href="#booking-form">Book now</a>
              <a className="ad-btn ad-btn--outline" href={whatsappIntro} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>
              <a className="ad-btn ad-btn--outline" href={`tel:${PHONE}`}><Phone size={18} /> Call now</a>
            </div>
          </div>
        </section>

        <section className="ad-proof-strip">
          <div className="container ad-proof-strip__inner">
            <span><Check size={16} /> Focused packages only</span>
            <span><Check size={16} /> Email + WhatsApp booking support</span>
            <span><Check size={16} /> Pickup guidance</span>
            <span><Check size={16} /> Local booking support</span>
          </div>
        </section>

        <section className="ad-packages" id="packages">
          <div className="container">
            <div className="ad-section-head" data-lux-reveal><span className="ad-eyebrow ad-eyebrow--dark">SELECTED PACKAGES</span><h2>{page.sectionTitle}</h2><p>{page.sectionCopy}</p></div>
            <div className="ad-package-grid">{page.tours.map((tour) => <CampaignPackageCard key={tour.title} tour={tour} campaignTitle={page.title} />)}</div>
          </div>
        </section>

        <section className="ad-benefits">
          <div className="container ad-benefits__grid">
            <div className="ad-benefits__intro" data-lux-reveal><span className="ad-eyebrow ad-eyebrow--dark">WHY THIS EXPERIENCE</span><h2>Everything you need to decide quickly.</h2><p>This page is intentionally focused on the service advertised, with only a few matching packages and direct booking options.</p></div>
            <ul className="ad-benefits__list" data-lux-reveal>{page.highlights.map((item) => <li key={item}><Check size={18} /><span>{item}</span></li>)}</ul>
          </div>
        </section>

        <section className="ad-details">
          <div className="container ad-details__grid">
            <div className="ad-detail-panel" data-lux-reveal><h2>Included</h2><ul>{page.included.map((item) => <li key={item}><Check size={17} /><span>{item}</span></li>)}</ul></div>
            <div className="ad-detail-panel ad-detail-panel--excluded" data-lux-reveal><h2>Not included</h2><ul>{page.excluded.map((item) => <li key={item}><X size={17} /><span>{item}</span></li>)}</ul></div>
            <div className="ad-detail-panel ad-detail-panel--before" data-lux-reveal><h2>Know before you go</h2><ul>{page.knowBefore.map((item) => <li key={item}><Check size={17} /><span>{item}</span></li>)}</ul></div>
          </div>
        </section>

        <section className="ad-booking-section">
          <div className="container ad-booking-section__grid">
            <div className="ad-booking-copy" data-lux-reveal><span className="ad-eyebrow">BOOK DIRECT</span><h2>Tell us your date and package.</h2><p>Complete the short form. Your request will open in WhatsApp with all booking details ready to send.</p><div className="ad-booking-contact"><a href={whatsappIntro} target="_blank" rel="noreferrer"><MessageCircle size={20} /> WhatsApp booking</a><a href={`tel:${PHONE}`}><Phone size={20} /> +971 54 993 0684</a></div></div>
            <BookingForm page={page} />
          </div>
        </section>

        <section className="ad-faqs">
          <div className="container ad-faqs__grid">
            <div className="ad-section-head" data-lux-reveal><span className="ad-eyebrow ad-eyebrow--dark">FAQS</span><h2>Questions before booking</h2></div>
            <div className="ad-faqs__list" data-lux-reveal>{page.faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}</summary><p>{answer}</p></details>)}</div>
          </div>
        </section>

        <ReviewsSection copy="4.9 ★ average guest rating with direct local booking support." />
      </main>
      <Footer />
      <CallFloat />
      <WhatsAppFloat />
      <div className="ad-mobile-bar"><a href={`tel:${PHONE}`}><Phone size={17} /> Call</a><a href={whatsappIntro} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a><a href="#booking-form">Book now</a></div>
    </div>
  )
}
