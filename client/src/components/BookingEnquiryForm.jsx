import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, CalendarDays, Check, ChevronDown, CreditCard, Mail, MapPin, MessageCircle, Minus, Phone, Plus, Send, ShieldCheck, Tag, Umbrella, X, Zap } from 'lucide-react'
import CountryCodeSelect from './CountryCodeSelect/CountryCodeSelect'
import { getBookingServices, getPricedAddOns } from '../bookingOptions'
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

// Custom dropdown so the arrow can rotate while the list is open.
function PackageSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (event) => { if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false) }
    const onKey = (event) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const choose = (option) => {
    onChange(option)
    setOpen(false)
  }

  return (
    <div className={`bk-select${open ? ' is-open' : ''}`} ref={rootRef}>
      <button type="button" className="bk-select__button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <span>{value}</span>
        <ChevronDown size={16} strokeWidth={2.6} className="bk-select__arrow" aria-hidden="true" />
      </button>
      {open && (
        <ul className="bk-select__list" role="listbox">
          {options.map((option) => (
            <li key={option} role="option" aria-selected={option === value}>
              <button type="button" className={option === value ? 'is-selected' : ''} onClick={() => choose(option)}>
                <span>{option}</span>
                {option === value && <Check size={14} strokeWidth={3} aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// "2 adults × AED 299 + add-ons AED 310" (used in the booking record and email).
function priceBreakdown(pricing) {
  return [
    pricing.perPerson ? `${pricing.adults} adult${pricing.adults > 1 ? 's' : ''} × AED ${pricing.unitAmount}` : null,
    pricing.addOnTotal ? `add-ons AED ${pricing.addOnTotal}` : null,
  ].filter(Boolean).join(' + ')
}

export default function BookingEnquiryForm({ tourTitle, displayPrice = 'Contact for price', unit = '', hideServiceSelector = false }) {
  const serviceOptions = useMemo(() => getBookingServices(tourTitle), [tourTitle])
  const addOnOptions = useMemo(() => getPricedAddOns(tourTitle), [tourTitle])

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

  const priceParts = useMemo(() => {
    const match = String(displayPrice).match(/^(?:from\s*)?([A-Za-z]{3})\s*([\d,.]+)/i)
    return match ? { currency: match[1].toUpperCase(), amount: match[2] } : { currency: '', amount: displayPrice }
  }, [displayPrice])

  // Ticked add-ons (flat AED price each) are added on top of the tour price.
  const selectedAddOns = useMemo(() => addOnOptions.filter((item) => form.addOns.includes(item.name)), [addOnOptions, form.addOns])
  const addOnTotal = useMemo(() => selectedAddOns.reduce((sum, item) => sum + item.price, 0), [selectedAddOns])

  // Per-person tours scale with the number of adults (children are free); add-ons are added on top.
  const pricing = useMemo(() => {
    const baseAmount = Number(String(displayPrice).replace(/[^\d.]/g, ''))
    if (!baseAmount) return null
    const perPerson = !unit || /person|pax|guest/i.test(unit)
    const adults = Math.max(1, Number(form.adults) || 1)
    const unitAmount = promo ? promo.discountedPrice : baseAmount
    const baseTotal = unitAmount * (perPerson ? adults : 1)
    const total = baseTotal + addOnTotal
    return { perPerson, adults, unitAmount, baseTotal, addOnTotal, total }
  }, [displayPrice, unit, form.adults, addOnTotal, promo, tourTitle])

  const stepGuests = (field, delta, min) => {
    setForm((current) => ({ ...current, [field]: String(Math.max(min, (Number(current[field]) || 0) + delta)) }))
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
          addOns: selectedAddOns.map((item) => `${item.name} (+AED ${item.price})`),
          pickup: form.pickup,
          price: pricing ? `AED ${pricing.total}${priceBreakdown(pricing) ? ` (${priceBreakdown(pricing)})` : ''}` : displayPrice,
          totalPrice: pricing ? `AED ${pricing.total}` : displayPrice,
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
        price: pricing ? formatAed(pricing.total) : (promo ? `${formatAed(promo.discountedPrice)}${promo.unit ? ` ${promo.unit}` : ''}` : displayPrice),
        addOns: selectedAddOns.map((item) => item.name),
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
      <div className="booking-enquiry-card__head bk-head">
        <div className="bk-head__text">
          <span className="bk-head__eyebrow"><Zap size={11} /> INSTANT RESERVATION</span>
          <h3 className="bk-head__title">Reserve Your Date</h3>
        </div>
        <div className="bk-head__price">
          {pricing ? (
            <strong><small>AED</small>{pricing.total.toLocaleString('en-US')}</strong>
          ) : (
            <strong className="is-text">{priceParts.currency && <small>{priceParts.currency}</small>}{priceParts.amount}</strong>
          )}
          {pricing && <em>
            {pricing.addOnTotal || (pricing.perPerson && pricing.adults > 1)
                ? `Total · ${pricing.perPerson ? `AED ${pricing.unitAmount.toLocaleString('en-US')} × ${pricing.adults} adult${pricing.adults > 1 ? 's' : ''}` : `AED ${pricing.unitAmount.toLocaleString('en-US')}`}${pricing.addOnTotal ? ' + add-ons' : ''}`
                : pricing.perPerson ? 'per person base' : (unit ? `per ${unit.replace('/', '')}` : 'total')}
          </em>}
          {promo && <em className="bk-head__was">was AED {promo.basePrice.toLocaleString('en-US')} · promo applied</em>}
          <span className="bk-head__badge"><Check size={10} /> No immediate payment needed</span>
        </div>
      </div>

      <form className="booking-enquiry-form" onSubmit={submit}>
        {!hideServiceSelector && (
          <div className="booking-enquiry-field booking-enquiry-field--full booking-enquiry-field--service">
            <span>Choose Package / Service</span>
            <PackageSelect value={form.service} options={serviceOptions} onChange={(service) => update({ target: { name: 'service', value: service, type: 'select' } })} />
          </div>
        )}

        <label className="booking-enquiry-field booking-enquiry-field--full booking-enquiry-field--date">
          <span><CalendarDays size={12} /> Select Travel Date</span>
          <input type="date" name="travelDate" value={form.travelDate} onChange={update} required />
        </label>

        <div className="bk-guests booking-enquiry-field--full">
          <div className="bk-stepper">
            <span>Adults <small>Age 12+</small></span>
            <div className="bk-stepper__control">
              <button type="button" onClick={() => stepGuests('adults', -1, 1)} aria-label="Decrease adults" disabled={Number(form.adults) <= 1}><Minus size={13} /></button>
              <strong aria-live="polite">{form.adults}</strong>
              <button type="button" className="is-plus" onClick={() => stepGuests('adults', 1, 1)} aria-label="Increase adults"><Plus size={13} /></button>
            </div>
          </div>
          <div className="bk-stepper">
            <span>Children <small>Age 3-11 (Free)</small></span>
            <div className="bk-stepper__control">
              <button type="button" onClick={() => stepGuests('children', -1, 0)} aria-label="Decrease children" disabled={Number(form.children) <= 0}><Minus size={13} /></button>
              <strong aria-live="polite">{form.children}</strong>
              <button type="button" className="is-plus" onClick={() => stepGuests('children', 1, 0)} aria-label="Increase children"><Plus size={13} /></button>
            </div>
          </div>
        </div>

        <label className="booking-enquiry-field booking-enquiry-field--full booking-enquiry-field--pickup">
          <span><MapPin size={12} /> Pickup Hotel / Residence in Dubai</span>
          <input type="text" name="pickup" value={form.pickup} onChange={update} placeholder="e.g. Atlantis The Palm, or Downtown Address" />
        </label>

        <fieldset className="booking-enquiry-addons booking-enquiry-field--full">
          <legend>Select Optional Add-ons</legend>
          <div className="bk-addons">
            {addOnOptions.map((addOn) => (
              <label key={addOn.name} className={`bk-addon${form.addOns.includes(addOn.name) ? ' is-selected' : ''}`}>
                <input type="checkbox" checked={form.addOns.includes(addOn.name)} onChange={() => toggleAddOn(addOn.name)} />
                <span className="bk-addon__name">{addOn.name}</span>
                <span className="bk-addon__price">+AED {addOn.price.toLocaleString('en-US')}</span>
              </label>
            ))}
          </div>

          {(pricing || addOnTotal > 0) && (
            <div className="bk-summary" aria-live="polite">
              {pricing && (
                <div className="bk-summary__row">
                  <span>{pricing.perPerson ? `${pricing.adults} adult${pricing.adults > 1 ? 's' : ''} × AED ${pricing.unitAmount.toLocaleString('en-US')}` : 'Package price'}</span>
                  <strong>AED {pricing.baseTotal.toLocaleString('en-US')}</strong>
                </div>
              )}
              {selectedAddOns.map((item) => (
                <div className="bk-summary__row bk-summary__row--addon" key={item.name}>
                  <span>{item.name}</span>
                  <strong>+AED {item.price.toLocaleString('en-US')}</strong>
                </div>
              ))}
              <div className="bk-summary__row bk-summary__row--total">
                <span>{pricing ? 'Estimated total' : 'Add-ons total'}</span>
                <strong>AED {(pricing ? pricing.total : addOnTotal).toLocaleString('en-US')}</strong>
              </div>
              {!pricing && <p className="bk-summary__note">The package price is confirmed by our team.</p>}
            </div>
          )}
        </fieldset>

        <div className="bk-phone booking-enquiry-field--full">
          <div className="bk-phone__label">
            <span>Phone / WhatsApp Number</span>
          </div>
          <div className="booking-enquiry-phone-group">
            <div className="booking-enquiry-field">
              <CountryCodeSelect value={form.countryCode} onChange={(countryCode) => setForm((current) => ({ ...current, countryCode }))} />
            </div>
            <label className="booking-enquiry-field">
              <input type="tel" name="phone" value={form.phone} onChange={update} placeholder="54 993 0684" inputMode="tel" minLength="7" maxLength="20" required aria-label="Phone number" />
            </label>
          </div>
        </div>

        <label className="booking-enquiry-field booking-enquiry-field--name">
          <span>Full name</span>
          <input type="text" name="name" value={form.name} onChange={update} placeholder="Your name" required />
        </label>

        <label className="booking-enquiry-field booking-enquiry-field--email">
          <span>Email</span>
          <input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" required />
        </label>

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
            {!submitting && <ArrowRight size={16} />}
          </button>
          <a href={`tel:${COMPANY_PHONE}`} className="booking-enquiry-call">
            <Phone size={16} />
            Direct Hotline: +971 54 993 0684
          </a>
        </div>
      </form>

      <ul className="bk-trust" aria-label="Booking assurances">
        <li><ShieldCheck size={13} /> Licensed DTCM Operator</li>
        <li><CreditCard size={13} /> Pay On Arrival Option</li>
        <li><Umbrella size={13} /> Passenger Insurance</li>
        <li><MessageCircle size={13} /> Instant Reply via WhatsApp</li>
      </ul>

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
              {confirmation.addOns?.length > 0 && <div><dt>Add-ons</dt><dd>{confirmation.addOns.join(', ')}</dd></div>}
              <div><dt>Total</dt><dd>{confirmation.price}{confirmation.promoCode && <small> · code {confirmation.promoCode}</small>}</dd></div>
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
