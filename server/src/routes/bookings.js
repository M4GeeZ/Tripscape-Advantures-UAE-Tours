import { Router } from 'express'
import nodemailer from 'nodemailer'

const router = Router()

const DEFAULT_BOOKING_EMAIL = 'info@tripscapeadventures.com'
const COMPANY_WHATSAPP = '971549930684'

function clean(value, fallback = '') {
  return String(value ?? fallback).trim()
}

function digits(value) {
  return clean(value).replace(/\D/g, '')
}

function escapeHtml(value) {
  return clean(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function makeBookingReference() {
  const stamp = new Date().toISOString().replace(/\D/g, '').slice(2, 12)
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `TS-${stamp}-${suffix}`
}

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 465)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) return null

  return nodemailer.createTransport({
    host,
    port,
    secure: String(process.env.SMTP_SECURE ?? port === 465).toLowerCase() === 'true',
    auth: { user, pass },
  })
}

async function sendWhatsAppTemplate({ to, templateName, parameters }) {
  const accessToken = clean(process.env.WHATSAPP_ACCESS_TOKEN)
  const phoneNumberId = clean(process.env.WHATSAPP_PHONE_NUMBER_ID)
  const graphVersion = clean(process.env.WHATSAPP_GRAPH_VERSION, 'v23.0')
  const languageCode = clean(process.env.WHATSAPP_TEMPLATE_LANGUAGE, 'en_US')

  if (!accessToken || !phoneNumberId || !templateName || !to) {
    return { status: 'skipped' }
  }

  const response = await fetch(`https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components: [
          {
            type: 'body',
            parameters: parameters.map((text) => ({ type: 'text', text: clean(text, '-') })),
          },
        ],
      },
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`WhatsApp API ${response.status}: ${body}`)
  }

  return { status: 'sent' }
}

router.post('/', async (req, res) => {
  const {
    tourTitle,
    price,
    name,
    age,
    adults,
    children,
    email,
    countryCode,
    phone,
    travelDate,
    hasWhatsApp,
  } = req.body || {}

  if (!tourTitle || !name || !age || !adults || !email || !countryCode || !phone || !travelDate) {
    return res.status(400).json({ message: 'Please complete all required booking fields.' })
  }

  const transporter = getTransporter()
  if (!transporter) {
    return res.status(503).json({
      message: 'Booking email is not configured yet. Please contact our team by phone or WhatsApp.',
    })
  }

  const bookingReference = makeBookingReference()
  const bookingTo = process.env.BOOKING_TO_EMAIL || DEFAULT_BOOKING_EMAIL
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || DEFAULT_BOOKING_EMAIL
  const fromName = process.env.SMTP_FROM_NAME || 'Tripscape Adventures'
  const safeTour = clean(tourTitle)
  const safeName = clean(name)
  const safeEmail = clean(email)
  const safeCountryCode = clean(countryCode)
  const safePhoneLocal = clean(phone)
  const safePhone = `${safeCountryCode} ${safePhoneLocal}`.trim()
  const whatsappPhone = digits(`${safeCountryCode}${safePhoneLocal}`)
  const safePrice = clean(price, 'Contact for price')
  const safeDate = clean(travelDate)
  const safeAge = clean(age)
  const safeAdults = clean(adults)
  const safeChildren = clean(children, '0')
  const whatsappStatus = hasWhatsApp ? 'Yes' : 'No'

  const rows = [
    ['Booking reference', bookingReference],
    ['Experience', safeTour],
    ['Price', safePrice],
    ['Travel date', safeDate],
    ['Customer', safeName],
    ['Age', safeAge],
    ['Adults', safeAdults],
    ['Children', safeChildren],
    ['Email', safeEmail],
    ['Country code', safeCountryCode],
    ['Phone', safePhone],
    ['WhatsApp on phone', whatsappStatus],
  ]

  const rowsHtml = rows.map(([label, value]) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:700;color:#172033">${escapeHtml(label)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#5d6570">${escapeHtml(value)}</td>
    </tr>
  `).join('')

  const companyHtml = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#172033">
      <h2 style="margin-bottom:6px">New booking enquiry</h2>
      <p style="color:#6a7280">A customer submitted a booking enquiry from tripscapetourism.com.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:18px">${rowsHtml}</table>
      ${hasWhatsApp ? `<p style="margin-top:20px"><a href="https://wa.me/${whatsappPhone}" style="color:#d28f26;font-weight:700">Open customer WhatsApp</a></p>` : ''}
    </div>
  `

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#172033">
      <h2 style="margin-bottom:6px">Booking enquiry received</h2>
      <p style="color:#6a7280;line-height:1.6">Thanks, ${escapeHtml(safeName)}. We received your booking enquiry for <strong>${escapeHtml(safeTour)}</strong>.</p>
      <p style="color:#6a7280;line-height:1.6">Reference: <strong>${escapeHtml(bookingReference)}</strong>. Our team will confirm availability, final price and booking details shortly.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:18px">${rowsHtml}</table>
      <p style="margin-top:20px;color:#6a7280;line-height:1.6">Need help now? Call +971 54 993 0684 or WhatsApp our booking team.</p>
    </div>
  `

  try {
    await Promise.all([
      transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: bookingTo,
        replyTo: safeEmail,
        subject: `[${bookingReference}] New booking enquiry: ${safeTour}`,
        html: companyHtml,
        text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
      }),
      transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: safeEmail,
        replyTo: bookingTo,
        subject: `[${bookingReference}] We received your Tripscape booking enquiry`,
        html: customerHtml,
        text: `Thanks, ${safeName}. We received your booking enquiry for ${safeTour}.\nReference: ${bookingReference}\n\n${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\nOur team will confirm availability shortly.`,
      }),
    ])

    let whatsappConfirmation = 'skipped'

    if (hasWhatsApp) {
      try {
        const result = await sendWhatsAppTemplate({
          to: whatsappPhone,
          templateName: clean(process.env.WHATSAPP_CONFIRMATION_TEMPLATE),
          parameters: [safeName, bookingReference, safeTour, safeDate],
        })
        whatsappConfirmation = result.status
      } catch (error) {
        console.error('Customer WhatsApp confirmation error:', error)
        whatsappConfirmation = 'failed'
      }
    }

    return res.status(201).json({
      message: 'Booking enquiry received and email confirmations sent.',
      bookingReference,
      whatsappConfirmation,
      companyWhatsApp: COMPANY_WHATSAPP,
    })
  } catch (error) {
    console.error('Booking email error:', error)
    return res.status(500).json({ message: 'We could not send the booking confirmation. Please try again or call us.' })
  }
})

export default router
