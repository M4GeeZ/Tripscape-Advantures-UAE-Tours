import { Router } from 'express'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import Booking from '../models/Booking.js'

const router = Router()

const DEFAULT_BOOKING_EMAIL = 'info@tripscapeadventures.com'
const COMPANY_PHONE_DISPLAY = '+971 54 993 0684'
const RETRY_INTERVAL_MS = Number(process.env.BOOKING_RETRY_INTERVAL_MS || 10 * 60 * 1000)
const RETRY_AFTER_MS = Number(process.env.BOOKING_RETRY_AFTER_MS || 10 * 60 * 1000)
const MAX_NOTIFICATION_ATTEMPTS = Number(process.env.BOOKING_NOTIFICATION_MAX_ATTEMPTS || 5)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const serverRoot = path.resolve(__dirname, '../..')

function clean(value, fallback = '') {
  return String(value ?? fallback).trim()
}

function singleLine(value, fallback = '') {
  return clean(value, fallback).replace(/[\r\n]+/g, ' ').slice(0, 300)
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
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `TS-${stamp}-${suffix}`
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(value))
}

function smtpConfigured() {
  return Boolean(clean(process.env.SMTP_HOST) && clean(process.env.SMTP_USER) && clean(process.env.SMTP_PASS))
}

function whatsappConfigured() {
  return Boolean(
    clean(process.env.WHATSAPP_ACCESS_TOKEN)
    && clean(process.env.WHATSAPP_PHONE_NUMBER_ID)
    && clean(process.env.WHATSAPP_CONFIRMATION_TEMPLATE),
  )
}

function getTransporter() {
  const host = clean(process.env.SMTP_HOST)
  const port = Number(process.env.SMTP_PORT || 465)
  const user = clean(process.env.SMTP_USER)
  const pass = clean(process.env.SMTP_PASS)

  if (!host || !user || !pass) return null

  return nodemailer.createTransport({
    host,
    port,
    secure: String(process.env.SMTP_SECURE ?? port === 465).toLowerCase() === 'true',
    auth: { user, pass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  })
}

async function sendWhatsAppTemplate({ to, templateName, parameters }) {
  const accessToken = clean(process.env.WHATSAPP_ACCESS_TOKEN)
  const phoneNumberId = clean(process.env.WHATSAPP_PHONE_NUMBER_ID)
  const graphVersion = clean(process.env.WHATSAPP_GRAPH_VERSION, 'v23.0')
  const languageCode = clean(process.env.WHATSAPP_TEMPLATE_LANGUAGE, 'en_US')

  if (!accessToken || !phoneNumberId || !templateName || !to) {
    return { status: 'not_configured' }
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
    throw new Error(`WhatsApp API ${response.status}: ${body.slice(0, 500)}`)
  }

  return { status: 'sent' }
}

function renderRows(rows) {
  return rows.map(([label, value]) => `
    <tr>
      <td style="padding:9px 12px;border-bottom:1px solid #eee;font-weight:700;color:#172033;vertical-align:top">${escapeHtml(label)}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #eee;color:#5d6570;vertical-align:top">${escapeHtml(value)}</td>
    </tr>
  `).join('')
}

function normalizeBooking(body = {}) {
  const adultCount = Number(body.adults)
  const childCount = Number(body.children || 0)
  const safeCountryCode = singleLine(body.countryCode)
  const safePhoneLocal = singleLine(body.phone)
  const phoneDigits = digits(`${safeCountryCode}${safePhoneLocal}`)
  const safeAddOns = Array.isArray(body.addOns)
    ? body.addOns.map((item) => singleLine(item)).filter(Boolean).slice(0, 20)
    : clean(body.addOns) ? [singleLine(body.addOns)] : []

  return {
    tourTitle: singleLine(body.tourTitle),
    service: singleLine(body.service, body.tourTitle),
    addOns: safeAddOns,
    pickup: singleLine(body.pickup).slice(0, 250),
    notes: clean(body.notes).slice(0, 1500),
    price: singleLine(body.price, 'Contact for price'),
    name: singleLine(body.name).slice(0, 120),
    adults: adultCount,
    children: childCount,
    email: singleLine(body.email).toLowerCase(),
    countryCode: safeCountryCode,
    phone: safePhoneLocal,
    phoneDigits,
    travelDate: singleLine(body.travelDate),
    hasWhatsApp: Boolean(body.hasWhatsApp),
  }
}

function validateBooking(booking) {
  if (!booking.tourTitle || !booking.service || !booking.name || !booking.email || !booking.countryCode || !booking.phone || !booking.travelDate) {
    return 'Please complete all required booking fields.'
  }
  if (!isValidEmail(booking.email)) return 'Please enter a valid email address.'
  if (booking.phoneDigits.length < 7 || booking.phoneDigits.length > 15) return 'Please enter a valid phone number.'
  if (!Number.isFinite(booking.adults) || booking.adults < 1 || !Number.isFinite(booking.children) || booking.children < 0) {
    return 'Please enter a valid number of adults and children.'
  }
  return ''
}

function bookingRows(booking) {
  const submittedAt = booking.createdAt
    ? new Date(booking.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Dubai' }) + ' (Dubai time)'
    : new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dubai' }) + ' (Dubai time)'

  return [
    ['Booking reference', booking.bookingReference],
    ['Experience', booking.tourTitle],
    ['Package / Service', booking.service],
    ['Price', booking.price || 'Contact for price'],
    ['Travel date', booking.travelDate],
    ['Customer', booking.name],
    ['Adults', String(booking.adults)],
    ['Children', String(booking.children || 0)],
    ['Email', booking.email],
    ['Phone', `${booking.countryCode} ${booking.phone}`.trim()],
    ['WhatsApp on this number', booking.hasWhatsApp ? 'Yes' : 'No'],
    ['Pickup / Hotel', booking.pickup || 'Not provided'],
    ['Add-ons', Array.isArray(booking.addOns) && booking.addOns.length ? booking.addOns.join(', ') : 'None selected'],
    ['Notes', booking.notes || 'None'],
    ['Submitted', submittedAt],
  ]
}

function emailContent(booking) {
  const rows = bookingRows(booking)
  const rowsHtml = renderRows(rows)
  const bookingTo = clean(process.env.BOOKING_TO_EMAIL, DEFAULT_BOOKING_EMAIL)

  const companyHtml = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#172033">
      <div style="padding:22px 24px;background:#101b2b;color:#fff;border-radius:14px 14px 0 0">
        <div style="font-size:12px;letter-spacing:.08em;color:#d59a36;font-weight:700">TRIPSCAPE BOOKING</div>
        <h2 style="margin:7px 0 0;font-size:24px">New reservation request</h2>
      </div>
      <div style="padding:22px 24px;border:1px solid #ececec;border-top:0;border-radius:0 0 14px 14px">
        <p style="margin:0;color:#616a76;line-height:1.6">A customer submitted a reservation request from tripscapetourism.com. Their complete details are below.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:18px">${rowsHtml}</table>
        ${booking.hasWhatsApp ? `<p style="margin:22px 0 0"><a href="https://wa.me/${booking.phoneDigits}" style="display:inline-block;padding:11px 15px;background:#d28f26;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">Open customer WhatsApp</a></p>` : ''}
      </div>
    </div>
  `

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#172033">
      <div style="padding:22px 24px;background:#101b2b;color:#fff;border-radius:14px 14px 0 0">
        <div style="font-size:12px;letter-spacing:.08em;color:#d59a36;font-weight:700">TRIPSCAPE ADVENTURES</div>
        <h2 style="margin:7px 0 0;font-size:24px">Reservation request received</h2>
      </div>
      <div style="padding:22px 24px;border:1px solid #ececec;border-top:0;border-radius:0 0 14px 14px">
        <p style="margin:0 0 12px;color:#5f6874;line-height:1.65">Dear ${escapeHtml(booking.name)},</p>
        <p style="margin:0 0 12px;color:#5f6874;line-height:1.65">Thank you for choosing Tripscape Adventures. We have received your reservation request for <strong>${escapeHtml(booking.service)}</strong>.</p>
        <p style="margin:0 0 18px;color:#5f6874;line-height:1.65">Your booking reference is <strong>${escapeHtml(booking.bookingReference)}</strong>. Our team will review availability and contact you with the final price and confirmation shortly.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:18px">${rowsHtml}</table>
        <p style="margin:22px 0 0;color:#5f6874;line-height:1.65">For urgent assistance, contact us at ${COMPANY_PHONE_DISPLAY}. We look forward to helping you plan your experience.</p>
      </div>
    </div>
  `

  const companyText = rows.map(([label, value]) => `${label}: ${value}`).join('\n')
  const customerText = [
    `Dear ${booking.name},`,
    '',
    `Thank you for choosing Tripscape Adventures. We received your reservation request for ${booking.service}.`,
    `Booking reference: ${booking.bookingReference}`,
    'Our booking team will review availability and contact you with the final price and confirmation shortly.',
    '',
    companyText,
    '',
    `For urgent assistance, call ${COMPANY_PHONE_DISPLAY}.`,
  ].join('\n')

  return { rows, companyHtml, customerHtml, companyText, customerText, bookingTo }
}

async function appendFallbackBooking(booking) {
  const configuredPath = clean(process.env.BOOKING_FALLBACK_FILE, 'data/bookings.ndjson')
  const filePath = path.isAbsolute(configuredPath) ? configuredPath : path.resolve(serverRoot, configuredPath)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.appendFile(filePath, `${JSON.stringify({ ...booking, storedAt: new Date().toISOString() })}\n`, 'utf8')
  return filePath
}

async function updateDelivery(bookingDoc, channel, status, error = '') {
  if (!bookingDoc?._id || mongoose.connection.readyState !== 1) return
  const base = `delivery.${channel}`
  const updates = {
    [`${base}.status`]: status,
    [`${base}.lastAttemptAt`]: new Date(),
    [`${base}.lastError`]: clean(error).slice(0, 1000),
  }
  const increments = { [`${base}.attempts`]: 1 }
  await Booking.updateOne({ _id: bookingDoc._id }, { $set: updates, $inc: increments }).catch(() => {})
}

function shouldAttemptChannel(entry, onlyPending) {
  if (!onlyPending) return true
  if (entry?.status === 'sent' || entry?.status === 'not_requested') return false
  return Number(entry?.attempts || 0) < MAX_NOTIFICATION_ATTEMPTS
}

async function deliverNotifications(bookingDocOrObject, { onlyPending = false } = {}) {
  const booking = bookingDocOrObject?.toObject ? bookingDocOrObject.toObject() : bookingDocOrObject
  const transporter = getTransporter()
  const { companyHtml, customerHtml, companyText, customerText, bookingTo } = emailContent(booking)
  const fromEmail = clean(process.env.SMTP_FROM_EMAIL, process.env.SMTP_USER || DEFAULT_BOOKING_EMAIL)
  const fromName = clean(process.env.SMTP_FROM_NAME, 'Tripscape Adventures')
  const result = {
    companyEmail: transporter ? 'pending' : 'not_configured',
    customerEmail: transporter ? 'pending' : 'not_configured',
    whatsappConfirmation: booking.hasWhatsApp ? (whatsappConfigured() ? 'pending' : 'not_configured') : 'not_requested',
  }

  const currentDelivery = booking.delivery || {}

  if (transporter && shouldAttemptChannel(currentDelivery.companyEmail, onlyPending)) {
    try {
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: bookingTo,
        replyTo: booking.email,
        subject: `[${booking.bookingReference}] New reservation request: ${singleLine(booking.service)}`,
        html: companyHtml,
        text: companyText,
      })
      result.companyEmail = 'sent'
      await updateDelivery(bookingDocOrObject, 'companyEmail', 'sent')
    } catch (error) {
      console.error('Company booking email error:', error)
      result.companyEmail = 'failed'
      await updateDelivery(bookingDocOrObject, 'companyEmail', 'failed', error.message)
    }
  } else if (onlyPending) {
    result.companyEmail = currentDelivery.companyEmail?.status || result.companyEmail
  }

  if (transporter && shouldAttemptChannel(currentDelivery.customerEmail, onlyPending)) {
    try {
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: booking.email,
        replyTo: bookingTo,
        subject: `[${booking.bookingReference}] Your Tripscape reservation request was received`,
        html: customerHtml,
        text: customerText,
      })
      result.customerEmail = 'sent'
      await updateDelivery(bookingDocOrObject, 'customerEmail', 'sent')
    } catch (error) {
      console.error('Customer confirmation email error:', error)
      result.customerEmail = 'failed'
      await updateDelivery(bookingDocOrObject, 'customerEmail', 'failed', error.message)
    }
  } else if (onlyPending) {
    result.customerEmail = currentDelivery.customerEmail?.status || result.customerEmail
  }

  if (booking.hasWhatsApp && whatsappConfigured() && shouldAttemptChannel(currentDelivery.customerWhatsApp, onlyPending)) {
    try {
      const waResult = await sendWhatsAppTemplate({
        to: booking.phoneDigits,
        templateName: clean(process.env.WHATSAPP_CONFIRMATION_TEMPLATE),
        parameters: [booking.name, booking.bookingReference, booking.service, booking.travelDate],
      })
      result.whatsappConfirmation = waResult.status
      await updateDelivery(bookingDocOrObject, 'customerWhatsApp', waResult.status)
    } catch (error) {
      console.error('Customer WhatsApp confirmation error:', error)
      result.whatsappConfirmation = 'failed'
      await updateDelivery(bookingDocOrObject, 'customerWhatsApp', 'failed', error.message)
    }
  } else if (booking.hasWhatsApp && onlyPending) {
    result.whatsappConfirmation = currentDelivery.customerWhatsApp?.status || result.whatsappConfirmation
  }

  if (bookingDocOrObject?._id && mongoose.connection.readyState === 1) {
    const retryNeeded = [result.companyEmail, result.customerEmail, result.whatsappConfirmation]
      .some((status) => status === 'failed' || status === 'pending' || status === 'not_configured')
    await Booking.updateOne(
      { _id: bookingDocOrObject._id },
      { $set: { nextNotificationAttemptAt: retryNeeded ? new Date(Date.now() + RETRY_AFTER_MS) : null } },
    ).catch(() => {})
  }

  return result
}

router.get('/health', (_req, res) => {
  res.json({
    ok: true,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    email: smtpConfigured() ? 'configured' : 'not_configured',
    whatsapp: whatsappConfigured() ? 'configured' : 'not_configured',
  })
})

router.post('/', async (req, res) => {
  const normalized = normalizeBooking(req.body || {})
  const validationError = validateBooking(normalized)
  if (validationError) return res.status(400).json({ message: validationError })

  const booking = {
    bookingReference: makeBookingReference(),
    ...normalized,
    source: 'tripscapetourism.com',
    delivery: {
      companyEmail: { status: smtpConfigured() ? 'pending' : 'not_configured', attempts: 0 },
      customerEmail: { status: smtpConfigured() ? 'pending' : 'not_configured', attempts: 0 },
      customerWhatsApp: {
        status: normalized.hasWhatsApp
          ? (whatsappConfigured() ? 'pending' : 'not_configured')
          : 'not_requested',
        attempts: 0,
      },
    },
    nextNotificationAttemptAt: new Date(Date.now() + RETRY_AFTER_MS),
  }

  let bookingDoc = null
  let storage = 'none'

  if (mongoose.connection.readyState === 1) {
    try {
      bookingDoc = await Booking.create(booking)
      storage = 'mongodb'
    } catch (error) {
      console.error('MongoDB booking save error:', error)
    }
  }

  if (!bookingDoc) {
    try {
      await appendFallbackBooking(booking)
      storage = 'file_fallback'
    } catch (error) {
      console.error('Fallback booking save error:', error)
    }
  }

  if (storage === 'none') {
    return res.status(503).json({
      message: 'We could not safely store your reservation request right now. Please try again or contact our booking team by phone or WhatsApp.',
    })
  }

  const delivery = await deliverNotifications(bookingDoc || booking)

  return res.status(201).json({
    message: 'Reservation request saved successfully.',
    bookingReference: booking.bookingReference,
    storage,
    companyEmail: delivery.companyEmail,
    customerEmail: delivery.customerEmail,
    whatsappConfirmation: delivery.whatsappConfirmation,
  })
})

let workerStarted = false

export function startBookingNotificationWorker() {
  if (workerStarted) return
  workerStarted = true

  const run = async () => {
    if (mongoose.connection.readyState !== 1) return
    try {
      const now = new Date()
      const bookings = await Booking.find({
        nextNotificationAttemptAt: { $ne: null, $lte: now },
        $or: [
          { 'delivery.companyEmail.status': { $in: ['pending', 'failed', 'not_configured'] } },
          { 'delivery.customerEmail.status': { $in: ['pending', 'failed', 'not_configured'] } },
          { 'delivery.customerWhatsApp.status': { $in: ['pending', 'failed', 'not_configured'] } },
        ],
      }).sort({ createdAt: 1 }).limit(20)

      for (const booking of bookings) {
        const maxAttemptsReached = ['companyEmail', 'customerEmail', 'customerWhatsApp'].every((channel) => {
          const entry = booking.delivery?.[channel]
          return ['sent', 'not_requested'].includes(entry?.status) || Number(entry?.attempts || 0) >= MAX_NOTIFICATION_ATTEMPTS
        })

        if (maxAttemptsReached) {
          booking.nextNotificationAttemptAt = null
          await booking.save().catch(() => {})
          continue
        }

        await deliverNotifications(booking, { onlyPending: true })
      }
    } catch (error) {
      console.error('Booking notification retry worker error:', error)
    }
  }

  setTimeout(run, 15000)
  const timer = setInterval(run, Math.max(RETRY_INTERVAL_MS, 60000))
  timer.unref?.()
}

export default router
