import { useEffect, useMemo, useRef, useState } from 'react'
import { Armchair, CalendarCheck, Car, Check, Clock3, Headphones, MapPin, Phone, ShieldCheck, Smile, Star, Wallet, X } from 'lucide-react'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
import CountryCodeSelect from '../../components/CountryCodeSelect/CountryCodeSelect'
import ReviewsSection from '../../components/ReviewsSection/ReviewsSection'
import { useLuxuryReveal } from '../../hooks/useLuxuryReveal'
import { getCampaignPage } from '../../campaignPages'
import { getTourDetailHref } from '../../tourDetails'
import { getBookingAddOns } from '../../bookingOptions'
import { apiUrl } from '../../utils/apiBaseUrl'
import createSubmissionId from '../../utils/createSubmissionId'
import { ExperiencePriceRow } from '../../components/ExperienceCard/ExperienceCard'
import { useTourCardImage } from '../../utils/tourImages'
import { applyMeta } from '../../SeoHead'
import { claimPageMeta } from '../../utils/metaOwner'
import '../../components/ExperienceCardActions/ExperienceCardActions.css'
import '../../components/ExperienceCard/ExperienceCard.css'
import './CampaignLanding.css'

const PHONE = '+971549930684'
const WHY_ICONS = { wallet: Wallet, support: Headphones, booking: CalendarCheck, everyone: Smile, comfort: Armchair, private: Car }
const WHATSAPP = '971549930684'

function tomorrow() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

function CampaignPackageCard({ tour, campaignTitle }) {
  const href = tour.href || getTourDetailHref(tour.category, tour.sourceTitle || tour.title)
  const contactPrice = /contact|aed\s*0/i.test(String(tour.price || ''))
  const cardImage = useTourCardImage(tour.sourceTitle || tour.title, tour.image, tour.slug)
  return (
    <article className="experience-card ad-package-card" data-lux-reveal>
      <a className="experience-card-media" href={href} aria-label={`View ${tour.title}`}>
        <img src={cardImage} alt={tour.title} loading="lazy" />
        {tour.category && <span className="experience-card-badge experience-card-badge--dark">{tour.category}</span>}
        {tour.duration && <span className="experience-card-meta"><Clock3 size={12} /> {tour.duration}</span>}
      </a>
      <div className="experience-card-body">
        <span className="experience-card-eyebrow"><Star size={10} fill="currentColor" /> 4.9 guest rating</span>
        <h3 className="experience-card-title"><a href={href}>{tour.title}</a></h3>
        <ul className="experience-card-points">
          <li>Campaign-relevant package</li>
          <li>Direct booking support</li>
          <li>Clear package confirmation</li>
        </ul>
        <ExperiencePriceRow price={contactPrice ? '' : tour.price} priceNote={tour.unit} />
        <div className="experience-card-actions">
          <a className="experience-card-action experience-card-action--primary" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Tripscape, I am interested in ${tour.title} from the ${campaignTitle} campaign.`)}`} target="_blank" rel="noreferrer"><WhatsAppIcon size={15} /> <span>Book Now</span></a>
          <a className="experience-card-action experience-card-action--outline" href={href}><span>View Details</span></a>
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
    name: '',
    email: '',
    countryCode: '+971',
    phone: '',
    hasWhatsApp: false,
    pickup: '',
    notes: '',
    addOns: []
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const submissionIdRef = useRef('')

  const addOnOptions = useMemo(
    () => getBookingAddOns(form.package || page.title),
    [form.package, page.title]
  )

  useEffect(() => {
    setForm((current) => ({
      ...current,
      package: page.tours[0]?.title || '',
      date: tomorrow(),
      addOns: []
    }))
  }, [page])

  const update = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'package' ? { addOns: [] } : {})
    }))
  }

  const toggleAddOn = (addOn) => {
    setForm((current) => ({
      ...current,
      addOns: current.addOns.includes(addOn)
        ? current.addOns.filter((item) => item !== addOn)
        : [...current.addOns, addOn]
    }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    setSubmitting(true)
    const submissionId = submissionIdRef.current || createSubmissionId()
    submissionIdRef.current = submissionId
    try {
      const selectedTour = page.tours.find((tour) => tour.title === form.package)
      const response = await fetch(apiUrl('/api/bookings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          tourTitle: form.package || page.title,
          service: form.package || page.title,
          price: selectedTour?.price || 'Contact for price',
          name: form.name,
          adults: form.adults,
          children: form.children,
          email: form.email,
          countryCode: form.countryCode,
          phone: form.phone,
          travelDate: form.date,
          hasWhatsApp: form.hasWhatsApp,
          pickup: form.pickup,
          notes: form.notes,
          addOns: form.addOns,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to send booking enquiry right now.')
      const customerEmailSent = data.customerEmail === 'sent'
      const companyEmailSent = data.companyEmail === 'sent'
      let confirmationMessage = `Reservation request ${data.bookingReference || ''} saved successfully. Your booking details are safely recorded.`

      if (customerEmailSent && companyEmailSent) {
        confirmationMessage += ' Confirmation has been sent to your email, and our booking team has received the request by email.'
      } else if (customerEmailSent) {
        confirmationMessage += ' Confirmation has been sent to your email. Our booking team will receive the saved request shortly.'
      } else {
        confirmationMessage += ' Your request is saved. Email confirmation is temporarily pending; our booking team will follow up.'
      }

      setStatus({ type: 'success', message: confirmationMessage })
    } catch (error) {
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
        <p>Choose a package, select any add-ons, and send your booking enquiry.</p>
      </div>

      <label className="ad-field ad-field--full">
        <span>Package</span>
        <select name="package" value={form.package} onChange={update}>
          {page.tours.map((tour) => <option key={tour.title} value={tour.title}>{tour.title}</option>)}
        </select>
      </label>

      <label className="ad-field"><span>Travel date</span><input type="date" name="date" value={form.date} onChange={update} required /></label>
      <label className="ad-field"><span>Adults</span><input type="number" min="1" name="adults" value={form.adults} onChange={update} required /></label>
      <label className="ad-field"><span>Children</span><input type="number" min="0" name="children" value={form.children} onChange={update} /></label>
      <label className="ad-field"><span>Name</span><input type="text" name="name" value={form.name} onChange={update} placeholder="Your name" required /></label>
      <label className="ad-field ad-field--full"><span>Email</span><input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" required /></label>

      <div className="ad-phone-row ad-field--full">
        <div className="ad-field"><span>Country code</span><CountryCodeSelect value={form.countryCode} onChange={(countryCode) => setForm((current) => ({ ...current, countryCode }))} /></div>
        <label className="ad-field"><span>Phone number</span><input type="tel" name="phone" value={form.phone} onChange={update} placeholder="50 123 4567" inputMode="tel" minLength="7" maxLength="20" required /></label>
      </div>

      <label className="ad-field ad-field--full"><span>Pickup / hotel</span><input type="text" name="pickup" value={form.pickup} onChange={update} placeholder="Hotel or area" /></label>
      <label className="ad-field ad-field--full"><span>Notes</span><textarea name="notes" rows="3" value={form.notes} onChange={update} placeholder="Any timing, celebration or package request" /></label>

      <fieldset className="ad-addons ad-field--full">
        <legend>Add-ons</legend>
        <p>Select any extra services you would like to request.</p>
        <div className="ad-addons__grid">
          {addOnOptions.map((addOn) => (
            <label className="ad-addon-option" key={addOn}>
              <input type="checkbox" checked={form.addOns.includes(addOn)} onChange={() => toggleAddOn(addOn)} />
              <span>{addOn}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="ad-field ad-field--full ad-whatsapp-check"><input type="checkbox" name="hasWhatsApp" checked={form.hasWhatsApp} onChange={update} /><span>This phone number has WhatsApp</span></label>
      {status.message && <div className={`ad-booking-status is-${status.type}`}>{status.message}</div>}
      <button type="submit" disabled={submitting} className="ad-booking-submit"><WhatsAppIcon size={18} /> {submitting ? 'Sending...' : 'Book Enquiry Now'}</button>
      <a className="ad-booking-call" href={`tel:${PHONE}`}><Phone size={17} /> Call +971 54 993 0684</a>
    </form>
  )
}

export default function CampaignLanding({ slug, menuOpen, setMenuOpen }) {
  const pageRef = useRef(null)
  const page = getCampaignPage(slug)
  const [cmsTours, setCmsTours] = useState([])
  useEffect(() => {
    let active = true
    const targetPath = window.location.pathname.replace(/\/+$/, '') || '/'
    fetch(apiUrl('/api/tours'))
      .then((response) => response.ok ? response.json() : [])
      .then((items) => {
        if (!active) return
        setCmsTours(Array.isArray(items) ? items.filter((item) => item?._id && item?.published !== false && (item.placements?.paths || []).some((target) => {
          try { return (new URL(target, window.location.origin).pathname.replace(/\/+$/, '') || '/') === targetPath }
          catch { return false }
        })) : [])
      })
      .catch(() => { if (active) setCmsTours([]) })
    return () => { active = false }
  }, [slug])
  const packageTours = useMemo(() => {
    const result = [...(page?.tours || [])]
    const seen = new Set(result.map((item) => String(item.title || '').trim().toLowerCase()))
    for (const item of cmsTours) {
      const key = String(item.title || '').trim().toLowerCase()
      if (!key || seen.has(key)) continue
      seen.add(key)
      result.push({ ...item, href: item.href || (item.categorySlug && item.slug ? '/tours/' + item.categorySlug + '/' + item.slug : '') })
    }
    return result
  }, [page, cmsTours])

  useLuxuryReveal(pageRef)

  useEffect(() => {
    if (!page) return
    window.scrollTo(0, 0)
    const canonicalPath = page.canonicalPath || `/tours/${page.slug}`
    claimPageMeta()
    applyMeta({ title: page.seoTitle, description: page.seoDescription, canonical: canonicalPath }, canonicalPath)
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
              <a className="ad-btn ad-btn--outline" href={whatsappIntro} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} /> WhatsApp</a>
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
            <div className={`ad-package-grid${page.fiveCardLayout ? ' ad-package-grid--five' : ''}`}>{packageTours.map((tour) => <CampaignPackageCard key={tour.title} tour={tour} campaignTitle={page.title} />)}</div>
          </div>
        </section>

        {page.whyChoose && (
          <section className="ad-why" aria-labelledby="ad-why-title">
            <div className="container">
              <div className="ad-section-head ad-section-head--center" data-lux-reveal><span className="ad-eyebrow ad-eyebrow--dark">WHY TRIPSCAPE</span><h2 id="ad-why-title">{page.whyChoose.title}</h2></div>
              <div className="ad-why__grid">
                {page.whyChoose.items.map((item) => {
                  const Icon = WHY_ICONS[item.icon] || Check
                  return (
                    <article className="ad-why__card" key={item.title} data-lux-reveal>
                      <span className="ad-why__icon"><Icon size={30} strokeWidth={1.8} /></span>
                      <div><h3>{item.title}</h3><p>{item.text}</p></div>
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        <section className="ad-booking-section">
          <div className="container ad-booking-section__grid">
            <div className="ad-booking-copy" data-lux-reveal><span className="ad-eyebrow">BOOK DIRECT</span><h2>Tell us your date and package.</h2><p>Complete the short form. Your request will open in WhatsApp with all booking details ready to send.</p><div className="ad-booking-contact"><a href={whatsappIntro} target="_blank" rel="noreferrer"><WhatsAppIcon size={20} /> WhatsApp booking</a><a href={`tel:${PHONE}`}><Phone size={20} /> +971 54 993 0684</a></div></div>
            <BookingForm page={{ ...page, tours: packageTours }} />
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

        <section className="ad-faqs">
          <div className="container ad-faqs__grid">
            <div className="ad-section-head" data-lux-reveal><span className="ad-eyebrow ad-eyebrow--dark">FAQS</span><h2>{page.faqsTitle || 'Questions before booking'}</h2></div>
            <div className="ad-faqs__list" data-lux-reveal>{page.faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary><h3>{question}</h3></summary><p>{answer}</p></details>)}</div>
          </div>
        </section>

        <ReviewsSection copy="4.9 ★ average guest rating with direct local booking support." />
      </main>
      <Footer />
      <CallFloat />
      <WhatsAppFloat />
      <div className="ad-mobile-bar"><a href={`tel:${PHONE}`}><Phone size={17} /> Call</a><a href={whatsappIntro} target="_blank" rel="noreferrer"><WhatsAppIcon size={17} /> WhatsApp</a><a href="#booking-form">Book now</a></div>
    </div>
  )
}
