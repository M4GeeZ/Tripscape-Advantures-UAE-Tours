import { useMemo, useState } from 'react'
import { Mail, MessageCircle, Phone, Send } from 'lucide-react'
import CountryCodeSelect from './CountryCodeSelect/CountryCodeSelect'
import './BookingEnquiryForm.css'

const COMPANY_WHATSAPP = '971549930684'
const COMPANY_PHONE = '+971549930684'

function tomorrow() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

export default function BookingEnquiryForm({ tourTitle, displayPrice = 'Contact for price' }) {
  const [form, setForm] = useState({
    name: '',
    age: '',
    adults: '1',
    children: '0',
    email: '',
    countryCode: '+971',
    phone: '',
    travelDate: tomorrow(),
    hasWhatsApp: true,
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const update = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const fullPhone = `${form.countryCode} ${form.phone}`.trim()

  const bookingMessage = useMemo(() => [
    `Hi Tripscape, I would like to book: ${tourTitle}`,
    `Travel date: ${form.travelDate}`,
    `Name: ${form.name || '-'}`,
    `Age: ${form.age || '-'}`,
    `Adults: ${form.adults}`,
    `Children: ${form.children}`,
    `Email: ${form.email || '-'}`,
    `Phone: ${form.phone ? fullPhone : '-'}`,
    `Country code: ${form.countryCode || '-'}`,
    `Price: ${displayPrice}`,
  ].join('\n'), [displayPrice, form, fullPhone, tourTitle])

  const whatsappHref = `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(bookingMessage)}`

  const submit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    setSubmitting(true)

    // Open a blank tab during the user gesture so popup blockers do not stop WhatsApp later.
    const whatsappWindow = form.hasWhatsApp ? window.open('', '_blank') : null

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourTitle,
          price: displayPrice,
          ...form,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to send booking request right now.')

      setStatus({
        type: 'success',
        message: form.hasWhatsApp
          ? (data.whatsappConfirmation === 'sent'
            ? 'Booking enquiry sent. Email and WhatsApp confirmation have been sent to you; WhatsApp is also opening so you can message our booking team.'
            : 'Booking enquiry sent. Email confirmation has been sent to you; WhatsApp is opening with your details ready to send to our booking team.')
          : 'Booking enquiry sent by email. Please check your inbox for confirmation.',
      })

      if (form.hasWhatsApp && whatsappWindow) {
        whatsappWindow.location.href = whatsappHref
      }
    } catch (error) {
      if (whatsappWindow) whatsappWindow.close()
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
        <p>Fill in your details to send a booking enquiry. You will receive email confirmation, and WhatsApp confirmation is also sent when available.</p>
      </div>

      <form className="booking-enquiry-form" onSubmit={submit}>
        <label className="booking-enquiry-field booking-enquiry-field--full">
          <span>Full name</span>
          <input type="text" name="name" value={form.name} onChange={update} placeholder="Your name" required />
        </label>

        <label className="booking-enquiry-field">
          <span>Age</span>
          <input type="number" min="1" max="100" name="age" value={form.age} onChange={update} placeholder="Age" required />
        </label>

        <label className="booking-enquiry-field">
          <span>Travel date</span>
          <input type="date" name="travelDate" value={form.travelDate} onChange={update} required />
        </label>

        <label className="booking-enquiry-field">
          <span>Adults</span>
          <input type="number" min="1" name="adults" value={form.adults} onChange={update} required />
        </label>

        <label className="booking-enquiry-field">
          <span>Children</span>
          <input type="number" min="0" name="children" value={form.children} onChange={update} />
        </label>

        <label className="booking-enquiry-field booking-enquiry-field--full">
          <span>Email</span>
          <input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" required />
        </label>

        <div className="booking-enquiry-phone-group booking-enquiry-field--full">
          <div className="booking-enquiry-field">
            <span>Country code</span>
            <CountryCodeSelect value={form.countryCode} onChange={(countryCode) => setForm((current) => ({ ...current, countryCode }))} />
          </div>
          <label className="booking-enquiry-field">
            <span>Phone number</span>
            <input type="tel" name="phone" value={form.phone} onChange={update} placeholder="50 123 4567" required />
          </label>
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
    </aside>
  )
}
