import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Mail, MessageCircle, Phone, Send, Tag, X } from 'lucide-react'
import CountryCodeSelect from './CountryCodeSelect/CountryCodeSelect'
import { getBookingAddOns, getBookingServices } from '../bookingOptions'
import { apiUrl } from '../utils/apiBaseUrl'
import createSubmissionId from '../utils/createSubmissionId'
import { formatAed, normalizeTourName, validatePromo } from '../utils/promoOffers'
import './BookingEnquiryForm.css'
import './BookingConfirm.css'

const COMPANY_PHONE = '+971549930684'

function tomorrow() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

export default function BookingEnquiryForm({ tourTitle, displayPrice = 'Contact for price', hideServiceSelector = false }) {
  const serviceOptions = useMemo(() => getBookingServices(tourTitle), [tourTitle])
  const addOnOptions = useMemo(() => getBookingAddOns(tourTitle), [tourTitle])

  const [form, setForm] = useState({
    service: hideServiceSelector ? tourTitle : (serviceOptions[0] || tourTitle),
    name: '',
    adults: '1',
    children: '0',
    email: '',
    countryCode: '+971',
    phone: '',
    travelDate: tomorrow(),
    pickup: '',
    addOns: [],
    hasWhatsApp: false,
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const submissionIdRef = useRef('')
  const [promoInput, setPromoInput] = useState('')
  const [confirmation, setConfirmation] = useState(null)
  const [promo, setPromo] = useState(null)
  const [promoStatus, setPromoStatus] = useState({ type: '', message: '' })
  const [checkingPromo, setCheckingPromo] = useState(false)

  const applyPromo = async (rawCode = promoInput) => {
    const code = String(rawCode || '').trim().toUpperCase()
    if (!code) return
    setCheckingPromo(true)
    setPromoStatus({ type: '', message: '' })
    try {
      const data = await validatePromo(code, tourTitle, form.service)
      setPromo(data)
      setPromoInput(data.code)
      setPromoStatus({ type: 'success', message: `${data.percent}% off applied — you save ${formatAed(data.basePrice - data.discountedPrice)}.` })
    } catch (error) {
      setPromo(null)
      setPromoStatus({ type: 'error', message: error.message })
    } finally {
      setCheckingPromo(false)
    }
  }

  const removePromo = () => {
    setPromo(null)
    setPromoInput('')
    setPromoStatus({ type: '', message: '' })
  }

  // Close the confirmation and get the form ready for a new booking.
  const closeConfirmation = () => {
    setConfirmation(null)
    setStatus({ type: '', message: '' })
    submissionIdRef.current = ''
    setPromo(null)
    setPromoInput('')
    setPromoStatus({ type: '', message: '' })
    setForm((current) => ({ ...current, name: '', email: '', phone: '', pickup: '', addOns: [], adults: '1', children: '0' }))
  }

  useEffect(() => {
    if (!confirmation) return undefined
    const onKey = (event) => { if (event.key === 'Escape') closeConfirmation() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmation])

  useEffect(() => {
    setForm((current) => ({
      ...current,
      service: hideServiceSelector ? tourTitle : (serviceOptions[0] || tourTitle),
      addOns: [],
    }))
    setPromo(null)
    setPromoInput('')
    setPromoStatus({ type: '', message: '' })
  }, [hideServiceSelector, serviceOptions, tourTitle])

  const update = (event) => {
    const { name, value, type, checked } = event.target
    if (name === 'service' && (promo || promoInput.trim()) && normalizeTourName(value) !== normalizeTourName(tourTitle)) {
      setPromo(null)
      setPromoStatus({ type: 'error', message: `Promo codes work with “${tourTitle}” only. Choose that package to use your code.` })
    }
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const toggleAddOn = (addOn) => {
    setForm((current) => ({
      ...current,
      addOns: current.addOns.includes(addOn)
        ? current.addOns.filter((item) => item !== addOn)
        : [...current.addOns, addOn],
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
          tourTitle,
          service: form.service,
          addOns: form.addOns,
          pickup: form.pickup,
          price: displayPrice,
          promoCode: promo?.code || promoInput.trim(),
          name: form.name,
          adults: form.adults,
          children: form.children,
          email: form.email,
          countryCode: form.countryCode,
          phone: form.phone,
          travelDate: form.travelDate,
          hasWhatsApp: form.hasWhatsApp,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to send booking request right now.')
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

      if (promo || promoInput.trim()) {
        confirmationMessage += ' Your promo code has been applied to this booking.'
      }
      setStatus({ type: 'success', message: confirmationMessage })
      setConfirmation({
        reference: data.bookingReference || '',
        service: form.service,
        travelDate: form.travelDate,
        adults: form.adults,
        children: form.children,
        price: promo ? `${formatAed(promo.discountedPrice)}${promo.unit ? ` ${promo.unit}` : ''}` : displayPrice,
        promoCode: promo?.code || '',
        email: form.email,
        emailSent: customerEmailSent,
        hasWhatsApp: form.hasWhatsApp,
      })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <aside className="booking-enquiry-card" data-lux-reveal>
      <div className="booking-enquiry-card__head">
        <span>BOOKING REQUEST</span>
        {promo ? (
          <strong className="booking-enquiry-card__promo-price">
            <s>{formatAed(promo.basePrice)}</s> {formatAed(promo.discountedPrice)}
            {promo.unit && <small>{promo.unit}</small>}
          </strong>
        ) : (
          <strong>{displayPrice}</strong>
        )}
        <p>Choose your preferred package or service, add any extras, and send your booking enquiry.</p>
      </div>

      <form className="booking-enquiry-form" onSubmit={submit}>
        {!hideServiceSelector && (
          <label className="booking-enquiry-field booking-enquiry-field--full booking-enquiry-field--service">
            <span>Package / Service</span>
            <select name="service" value={form.service} onChange={update}>
              {serviceOptions.map((service) => <option key={service} value={service}>{service}</option>)}
            </select>
          </label>
        )}

        <label className="booking-enquiry-field booking-enquiry-field--name">
          <span>Full name</span>
          <input type="text" name="name" value={form.name} onChange={update} placeholder="Your name" required />
        </label>

        <label className="booking-enquiry-field booking-enquiry-field--email">
          <span>Email</span>
          <input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" required />
        </label>

        <label className="booking-enquiry-field booking-enquiry-field--date">
          <span>Travel date</span>
          <input type="date" name="travelDate" value={form.travelDate} onChange={update} required />
        </label>

        <label className="booking-enquiry-field booking-enquiry-field--guest">
          <span>Adults</span>
          <input type="number" min="1" name="adults" value={form.adults} onChange={update} required />
        </label>

        <label className="booking-enquiry-field booking-enquiry-field--guest">
          <span>Children</span>
          <input type="number" min="0" name="children" value={form.children} onChange={update} />
        </label>

        <label className="booking-enquiry-field booking-enquiry-field--pickup">
          <span>Pickup / hotel</span>
          <input type="text" name="pickup" value={form.pickup} onChange={update} placeholder="Hotel or area" />
        </label>

        <div className="booking-enquiry-phone-group booking-enquiry-field--full">
          <div className="booking-enquiry-field">
            <span>Country code</span>
            <CountryCodeSelect value={form.countryCode} onChange={(countryCode) => setForm((current) => ({ ...current, countryCode }))} />
          </div>
          <label className="booking-enquiry-field">
            <span>Phone number</span>
            <input type="tel" name="phone" value={form.phone} onChange={update} placeholder="50 123 4567" inputMode="tel" minLength="7" maxLength="20" required />
          </label>
        </div>

        <fieldset className="booking-enquiry-addons booking-enquiry-field--full">
          <legend>Add-ons</legend>
          <p>Select any extra services you want with this booking.</p>
          <div className="booking-enquiry-addons__grid">
            {addOnOptions.map((addOn) => (
              <label key={addOn} className="booking-enquiry-addon-option">
                <input
                  type="checkbox"
                  checked={form.addOns.includes(addOn)}
                  onChange={() => toggleAddOn(addOn)}
                />
                <span>{addOn}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="booking-enquiry-promo booking-enquiry-field--full">
          <span>Promo code</span>
          <div className="booking-enquiry-promo__row">
            <Tag size={16} aria-hidden="true" />
            <input
              type="text"
              value={promoInput}
              onChange={(event) => {
                setPromoInput(event.target.value.toUpperCase())
                if (promo) setPromo(null)
                setPromoStatus({ type: '', message: '' })
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  applyPromo()
                }
              }}
              placeholder="e.g. QUAD20-K7P3X"
              aria-label="Promo code"
              autoComplete="off"
              spellCheck="false"
            />
            {promo ? (
              <button type="button" className="booking-enquiry-promo__remove" onClick={removePromo} aria-label="Remove promo code"><X size={15} /></button>
            ) : (
              <button type="button" className="booking-enquiry-promo__apply" onClick={() => applyPromo()} disabled={!promoInput.trim() || checkingPromo}>
                {checkingPromo ? 'Checking…' : 'Apply'}
              </button>
            )}
          </div>
          {promoStatus.message && <small className={`booking-enquiry-promo__status is-${promoStatus.type}`}>{promoStatus.message}</small>}
        </div>

        <label className="booking-enquiry-whatsapp-check booking-enquiry-field--full">
          <input type="checkbox" name="hasWhatsApp" checked={form.hasWhatsApp} onChange={update} />
          <span>This phone number has WhatsApp</span>
        </label>

        {status.message && (
          <div className={`booking-enquiry-status is-${status.type}`} role="status">
            {status.type === 'success' ? <Mail size={16} /> : <Send size={16} />}
            <span>{status.message}</span>
          </div>
        )}

        <div className="booking-enquiry-actions booking-enquiry-field--full">
          <button type="submit" disabled={submitting} className="booking-enquiry-submit">
            {form.hasWhatsApp ? <MessageCircle size={18} /> : <Mail size={18} />}
            {submitting ? 'Sending...' : 'Book Enquiry Now'}
          </button>
          <a href={`tel:${COMPANY_PHONE}`} className="booking-enquiry-call">
            <Phone size={18} />
            Call Now
          </a>
        </div>
      </form>

      {confirmation && createPortal(
        <div className="booking-confirm" role="dialog" aria-modal="true" aria-labelledby="booking-confirm-title" onClick={closeConfirmation}>
          <div className="booking-confirm__card" onClick={(event) => event.stopPropagation()}>
            <div className="booking-confirm__confetti" aria-hidden="true">
              {Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--i': index }} />)}
            </div>

            <svg className="booking-confirm__check" viewBox="0 0 80 80" aria-hidden="true">
              <circle className="booking-confirm__ring" cx="40" cy="40" r="36" />
              <path className="booking-confirm__tick" d="M24 41.5 35 52 57 29" />
            </svg>

            <span className="booking-confirm__eyebrow">Thank you, {form.name.split(' ')[0] || 'guest'}!</span>
            <h3 id="booking-confirm-title">Booking Received!</h3>
            <p className="booking-confirm__lead">
              Your booking request is saved. Our team will confirm availability and pickup details shortly
              {confirmation.hasWhatsApp ? ' on WhatsApp and email.' : ' by email.'}
            </p>

            <dl className="booking-confirm__summary">
              {confirmation.reference && <div><dt>Reference</dt><dd>{confirmation.reference}</dd></div>}
              <div><dt>Experience</dt><dd>{confirmation.service}</dd></div>
              <div><dt>Travel date</dt><dd>{confirmation.travelDate}</dd></div>
              <div><dt>Guests</dt><dd>{confirmation.adults} adult{Number(confirmation.adults) > 1 ? 's' : ''}{Number(confirmation.children) > 0 ? `, ${confirmation.children} child${Number(confirmation.children) > 1 ? 'ren' : ''}` : ''}</dd></div>
              <div><dt>Price</dt><dd>{confirmation.price}{confirmation.promoCode && <small> · code {confirmation.promoCode}</small>}</dd></div>
            </dl>

            {confirmation.emailSent && <p className="booking-confirm__email"><Mail size={14} /> A copy has been sent to {confirmation.email}</p>}

            <div className="booking-confirm__actions">
              <button type="button" className="booking-confirm__done" onClick={closeConfirmation}>Done</button>
              <a
                className="booking-confirm__whatsapp"
                href={`https://wa.me/971549930684?text=${encodeURIComponent(`Hi Tripscape, I just sent booking request ${confirmation.reference} for ${confirmation.service} on ${confirmation.travelDate}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </aside>
  )
}
