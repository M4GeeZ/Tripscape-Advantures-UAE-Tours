import { useEffect, useMemo, useRef, useState } from 'react'
import { Mail, MessageCircle, Phone, Send } from 'lucide-react'
import CountryCodeSelect from './CountryCodeSelect/CountryCodeSelect'
import { getBookingAddOns, getBookingServices } from '../bookingOptions'
import { apiUrl } from '../utils/apiBaseUrl'
import createSubmissionId from '../utils/createSubmissionId'
import './BookingEnquiryForm.css'

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

  useEffect(() => {
    setForm((current) => ({
      ...current,
      service: hideServiceSelector ? tourTitle : (serviceOptions[0] || tourTitle),
      addOns: [],
    }))
  }, [hideServiceSelector, serviceOptions, tourTitle])

  const update = (event) => {
    const { name, value, type, checked } = event.target
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

      setStatus({ type: 'success', message: confirmationMessage })
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
        <strong>{displayPrice}</strong>
        <p>Choose your preferred package or service, add any extras, and send your booking enquiry.</p>
      </div>

      <form className="booking-enquiry-form" onSubmit={submit}>
        {!hideServiceSelector && (
          <label className="booking-enquiry-field booking-enquiry-field--full">
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
    </aside>
  )
}
