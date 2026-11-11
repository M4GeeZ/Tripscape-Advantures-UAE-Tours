import { claimPageMeta } from '../../utils/metaOwner'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Phone, PlayCircle, ShieldCheck, Star, X } from 'lucide-react'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
import CountryCodeSelect from '../../components/CountryCodeSelect/CountryCodeSelect'
import { useLuxuryReveal } from '../../hooks/useLuxuryReveal'
import { getBookingAddOns } from '../../bookingOptions'
import { apiUrl } from '../../utils/apiBaseUrl'
import createSubmissionId from '../../utils/createSubmissionId'
import './DesertEJet.css'

const WHATSAPP = '971549930684'
const PHONE = '+971549930684'

const packages = [
  { name: '10 Laps Water Go Kart', price: 250 },
  { name: '15 Laps Water Go Kart', price: 300 }
]

function tomorrow() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

export default function DesertEJet({ menuOpen, setMenuOpen }) {
  const pageRef = useRef(null)
  const [form, setForm] = useState({ package: packages[0].name, date: tomorrow(), riders: '1', name: '', email: '', countryCode: '+971', phone: '', hasWhatsApp: false, pickup: '', notes: '', addOns: [] })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const submissionIdRef = useRef('')
  useLuxuryReveal(pageRef)

  useEffect(() => {
    window.scrollTo(0, 0)
    claimPageMeta()
    document.title = 'Water Go Kart Dubai | Desert E-Jet Experience'
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = 'Book Desert E-Jet water go kart Dubai. Race across a desert lagoon with safety gear, staff supervision, 10-lap and 15-lap options and transfer support.'
  }, [])

  const selected = packages.find((item) => item.name === form.package) || packages[0]
  const addOnOptions = useMemo(() => getBookingAddOns('Desert E-Jet Water Go Kart Dubai'), [])
  const update = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
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
      const response = await fetch(apiUrl('/api/bookings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          tourTitle: 'Desert E-Jet Water Go Kart Dubai',
          service: form.package,
          price: `AED ${selected.price * Number(form.riders || 1)} estimated`,
          name: form.name,
          adults: form.riders,
          children: '0',
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
      let confirmationMessage = `Reservation request ${data.bookingReference || ''} submitted successfully. Our team received your complete booking details.`

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
    <div className="ejet-page" ref={pageRef}>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} variant="overlay" />
      <main>
        <section className="ejet-hero">
          <img src="/images/desert-ejet/ejet-track-1.jpg" alt="Desert E-Jet water go kart track in Dubai" />
          <div className="ejet-hero__overlay" />
          <div className="container ejet-hero__content">
            <span>DESERT ACTIVITIES · WATER GO KART DUBAI</span>
            <h1>Desert E-Jet Water Go Kart Dubai</h1>
            <p>Defy the desert heat with a splash of speed. Race across a shimmering desert lagoon in high-powered mini water karts designed for aquatic thrills.</p>
            <div className="ejet-hero__actions">
              <a href="#ejet-book" className="ejet-btn ejet-btn--gold">Book from AED 250</a>
              <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hi Tripscape, I want details for Desert E-Jet Water Go Kart Dubai.')}`} target="_blank" rel="noreferrer" className="ejet-btn ejet-btn--dark"><WhatsAppIcon size={18}/> WhatsApp</a>
              <a href={`tel:${PHONE}`} className="ejet-btn ejet-btn--dark"><Phone size={18}/> Call</a>
            </div>
          </div>
        </section>

        <section className="ejet-intro">
          <div className="container ejet-intro__grid">
            <div data-lux-reveal>
              <span className="ejet-eyebrow">ONE-OF-A-KIND DESERT ACTIVITY</span>
              <h2>Go karting — on water.</h2>
            </div>
            <div data-lux-reveal>
              <p>Whether you are drifting solo or racing your crew, Desert E-Jet combines speed, water and surreal desert scenery in one unexpected experience.</p>
              <div className="ejet-feature-grid">
                <div><strong>Water Racing Madness</strong><span>Feel the thrill of go-karting on water.</span></div>
                <div><strong>Easy Controls</strong><span>Beginner-friendly, safe and fun to operate.</span></div>
                <div><strong>Group Friendly</strong><span>Ideal for families, friends and team outings.</span></div>
                <div><strong>Scenic Vibes</strong><span>Desert views meet a sparkling water track.</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="ejet-media">
          <div className="container">
            <div className="ejet-media__head" data-lux-reveal><span className="ejet-eyebrow">SEE THE EXPERIENCE</span><h2>Water, speed and desert scenery.</h2></div>
            <div className="ejet-media__grid">
              <figure data-lux-reveal><img src="/images/desert-ejet/ejet-track-2.jpg" alt="Desert E-Jet lagoon track" /></figure>
              <figure className="ejet-video-card" data-lux-reveal><video controls playsInline preload="metadata" poster="/images/desert-ejet/ejet-track-1.jpg"><source src="/videos/desert-ejet/ejet-ride.mp4" type="video/mp4" /></video><span><PlayCircle size={18}/> Ride video</span></figure>
              <figure className="ejet-video-card" data-lux-reveal><video controls playsInline preload="metadata" poster="/images/desert-ejet/ejet-pricing.jpg"><source src="/videos/desert-ejet/ejet-ride-2.mp4" type="video/mp4" /></video><span><PlayCircle size={18}/> Track video</span></figure>
            </div>
          </div>
        </section>

        <section className="ejet-packages">
          <div className="container ejet-packages__grid">
            <div data-lux-reveal><span className="ejet-eyebrow">PRICING</span><h2>Choose your laps</h2><p>Simple water go-kart options based on the pricing supplied for this experience.</p></div>
            <div className="ejet-package-list">
              {packages.map((item) => <article key={item.name} data-lux-reveal><span>{item.name}</span><strong>AED {item.price}</strong><a href="#ejet-book">Book now</a></article>)}
            </div>
          </div>
        </section>

        <section className="ejet-details">
          <div className="container ejet-details__grid">
            <article data-lux-reveal><h2>Included</h2><ul>{['Ride on a water go-kart','Quick orientation on controls and safety','Life jackets and helmets provided','Transfers'].map((item)=><li key={item}><Check size={17}/>{item}</li>)}</ul></article>
            <article data-lux-reveal><h2>Excluded</h2><ul><li><X size={17}/>Food and beverages</li></ul></article>
            <article data-lux-reveal><h2>Know before you start</h2><ul>{['Wear quick-dry clothes, sunscreen and sunglasses with a strap','Age limit: 8+ years; minimum height 120 cm','Mandatory safety gear and staff supervision','Arrive 15–20 minutes early','Advance booking recommended; group discounts may be available','No pets, alcohol, valuables or intoxicated riders'].map((item)=><li key={item}><ShieldCheck size={17}/>{item}</li>)}</ul></article>
          </div>
        </section>

        <section className="ejet-booking" id="ejet-book">
          <div className="container ejet-booking__grid">
            <div data-lux-reveal><span className="ejet-eyebrow">BOOK DESERT E-JET</span><h2>Send your ride request.</h2><p>Choose your laps and date. Your enquiry is emailed for confirmation and WhatsApp opens when you select WhatsApp support.</p><div className="ejet-rating"><Star size={17} fill="currentColor"/> Adventure booking support</div></div>
            <form onSubmit={submit} className="ejet-form" data-lux-reveal>
              <label><span>Package</span><select name="package" value={form.package} onChange={update}>{packages.map((item)=><option key={item.name}>{item.name}</option>)}</select></label>
              <label><span>Date</span><input type="date" name="date" value={form.date} onChange={update} required/></label>
              <label><span>Riders</span><input type="number" min="1" name="riders" value={form.riders} onChange={update} required/></label>
              <label><span>Name</span><input name="name" value={form.name} onChange={update} required placeholder="Your name"/></label>
              <label className="ejet-form__full"><span>Email</span><input type="email" name="email" value={form.email} onChange={update} required placeholder="you@example.com"/></label>
              <label className="ejet-form__full"><span>Pickup / hotel</span><input name="pickup" value={form.pickup} onChange={update} placeholder="Hotel or area"/></label>
              <div className="ejet-phone-row ejet-form__full">
                <div className="ejet-country-field"><span>Country code</span><CountryCodeSelect value={form.countryCode} onChange={(countryCode) => setForm((current) => ({ ...current, countryCode }))} /></div>
                <label><span>Phone number</span><input type="tel" name="phone" value={form.phone} onChange={update} required inputMode="tel" minLength="7" maxLength="20" placeholder="50 123 4567"/></label>
              </div>
              <label className="ejet-form__full ejet-whatsapp-check"><input type="checkbox" name="hasWhatsApp" checked={form.hasWhatsApp} onChange={update}/><span>This phone number has WhatsApp</span></label>
              <label className="ejet-form__full"><span>Notes</span><textarea name="notes" value={form.notes} onChange={update} rows="3" placeholder="Group size or questions"/></label>
              <fieldset className="ejet-addons ejet-form__full">
                <legend>Add-ons</legend>
                <p>Select any extra services you would like to request.</p>
                <div className="ejet-addons__grid">
                  {addOnOptions.map((addOn) => (
                    <label className="ejet-addon-option" key={addOn}>
                      <input type="checkbox" checked={form.addOns.includes(addOn)} onChange={() => toggleAddOn(addOn)}/>
                      <span>{addOn}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="ejet-form__total"><span>Estimated activity price</span><strong>AED {selected.price * Number(form.riders || 1)}</strong></div>
              {status.message && <div className={`ejet-form-status is-${status.type}`}>{status.message}</div>}
              <button type="submit" disabled={submitting}><WhatsAppIcon size={18}/> {submitting ? 'Sending...' : 'Book Enquiry Now'}</button>
              <a href={`tel:${PHONE}`}><Phone size={17}/> Call +971 54 993 0684</a>
            </form>
          </div>
        </section>
      </main>
      <Footer />
      <CallFloat />
      <WhatsAppFloat />
    </div>
  )
}
