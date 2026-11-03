import { Router } from 'express'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import Booking from '../models/Booking.js'
import { normalizePromoCode, redeemPromoCode, releasePromoCode } from './promos.js'

const router = Router()

const DEFAULT_BOOKING_EMAIL = 'info@tripscapetourism.com'
const COMPANY_PHONE_DISPLAY = '+971 54 993 0684'
const DEFAULT_BOOKING_WHATSAPP_TO = '971549930684'
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
  const primary = Boolean(clean(process.env.SMTP_HOST) && clean(process.env.SMTP_USER) && clean(process.env.SMTP_PASS))
  const fallback = Boolean(clean(process.env.SMTP_FALLBACK_HOST) && clean(process.env.SMTP_FALLBACK_USER) && clean(process.env.SMTP_FALLBACK_PASS))
  return primary || fallback
}

function whatsappApiConfigured() {
  return Boolean(
    clean(process.env.WHATSAPP_ACCESS_TOKEN)
    && clean(process.env.WHATSAPP_PHONE_NUMBER_ID),
  )
}

function customerWhatsappTemplate() {
  return clean(process.env.WHATSAPP_CUSTOMER_TEMPLATE || process.env.WHATSAPP_CONFIRMATION_TEMPLATE)
}

function companyWhatsappTemplate() {
  return clean(process.env.WHATSAPP_COMPANY_TEMPLATE)
}

function customerWhatsappConfigured() {
  return whatsappApiConfigured() && Boolean(customerWhatsappTemplate())
}

function companyWhatsappConfigured() {
  return whatsappApiConfigured() && Boolean(companyWhatsappTemplate()) && Boolean(digits(process.env.BOOKING_WHATSAPP_TO || DEFAULT_BOOKING_WHATSAPP_TO))
}

function normalizeSmtpPassword(host, value) {
  const password = String(value ?? '')
    .trim()
    .replace(/^['"]+|['"]+$/g, '')
  // Google app passwords are commonly copied as four groups with spaces.
  // Gmail expects the 16-character value without those spaces.
  if (clean(host).toLowerCase().includes('gmail.com')) return password.replace(/\s+/g, '')
  return password
}

function smtpProvider(prefix = 'SMTP') {
  const host = clean(process.env[`${prefix}_HOST`])
  const port = Number(process.env[`${prefix}_PORT`] || 465)
  const user = clean(process.env[`${prefix}_USER`])
  const pass = normalizeSmtpPassword(host, process.env[`${prefix}_PASS`])
  const secure = String(process.env[`${prefix}_SECURE`] ?? port === 465).toLowerCase() === 'true'
  const authMethod = clean(process.env[`${prefix}_AUTH_METHOD`])
  const fromName = clean(process.env[`${prefix}_FROM_NAME`], clean(process.env.SMTP_FROM_NAME, 'Tripscape Tourism'))
  const fromEmail = clean(process.env[`${prefix}_FROM_EMAIL`], user)

  if (!host || !user || !pass) return null

  const transportOptions = {
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  }
  if (authMethod) transportOptions.authMethod = authMethod

  return {
    name: prefix === 'SMTP' ? 'primary' : 'fallback',
    host,
    user,
    fromName,
    fromEmail,
    transporter: nodemailer.createTransport(transportOptions),
  }
}

function getSmtpProviders() {
  return [smtpProvider('SMTP'), smtpProvider('SMTP_FALLBACK')].filter(Boolean)
}

async function sendMailWithFallback(mailFactory) {
  const providers = getSmtpProviders()
  if (!providers.length) {
    const error = new Error('No SMTP provider is configured.')
    error.code = 'SMTP_NOT_CONFIGURED'
    throw error
  }

  const failures = []
  for (const provider of providers) {
    try {
      const mail = mailFactory(provider)
      const info = await provider.transporter.sendMail(mail)
      console.log(`Booking email sent via ${provider.name} SMTP (${provider.host})`, {
        messageId: info?.messageId || '',
        accepted: info?.accepted || [],
        rejected: info?.rejected || [],
      })
      return { provider: provider.name, info }
    } catch (error) {
      failures.push(`${provider.name}: ${notificationError(error)}`)
      console.error(`Booking email ${provider.name} SMTP error:`, error)
    }
  }

  const error = new Error(`All configured SMTP providers failed. ${failures.join(' || ')}`)
  error.code = 'SMTP_ALL_PROVIDERS_FAILED'
  throw error
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
    signal: AbortSignal.timeout(15000),
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
    submissionId: singleLine(body.submissionId).slice(0, 120),
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
    hasWhatsApp: body.hasWhatsApp === true || body.hasWhatsApp === 'true',
    promoCode: normalizePromoCode(body.promoCode).slice(0, 40),
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
    ...(booking.promoCode ? [['Promo code', `${booking.promoCode} (${booking.promoPercent}% off, was ${booking.originalPrice})`]] : []),
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


function fallbackQueueDirectory() {
  const configuredPath = clean(process.env.BOOKING_FALLBACK_QUEUE_DIR, 'data/booking-notification-queue')
  return path.isAbsolute(configuredPath) ? configuredPath : path.resolve(serverRoot, configuredPath)
}

const FALLBACK_QUEUE_EXTENSION = '.booking-job'

function fallbackQueueFileName(bookingReference) {
  return `${clean(bookingReference).replace(/[^a-zA-Z0-9_-]/g, '_')}${FALLBACK_QUEUE_EXTENSION}`
}

function legacyFallbackQueueFileName(bookingReference) {
  return `${clean(bookingReference).replace(/[^a-zA-Z0-9_-]/g, '_')}.json`
}

async function persistFallbackQueueJob(booking) {
  const dir = fallbackQueueDirectory()
  await fs.mkdir(dir, { recursive: true })
  const filePath = path.join(dir, fallbackQueueFileName(booking.bookingReference))
  const payload = { ...booking, queueUpdatedAt: new Date().toISOString() }
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8')
  return filePath
}

async function removeFallbackQueueJob(bookingReference) {
  const dir = fallbackQueueDirectory()
  const filePaths = [
    path.join(dir, fallbackQueueFileName(bookingReference)),
    path.join(dir, legacyFallbackQueueFileName(bookingReference)),
  ]

  await Promise.all(filePaths.map((filePath) => fs.unlink(filePath).catch((error) => {
    if (error?.code !== 'ENOENT') throw error
  })))
}

async function readFallbackQueueJobs(limit = 20) {
  const dir = fallbackQueueDirectory()
  let names = []
  try {
    names = await fs.readdir(dir)
  } catch (error) {
    if (error?.code === 'ENOENT') return []
    throw error
  }

  const jobs = []
  const seenReferences = new Set()
  const queueNames = names
    .filter((item) => item.endsWith(FALLBACK_QUEUE_EXTENSION) || item.endsWith('.json'))
    // Prefer the current format when a legacy .json copy exists for the same booking.
    .sort((left, right) => Number(left.endsWith('.json')) - Number(right.endsWith('.json')))

  for (const name of queueNames) {
    if (jobs.length >= limit) break
    try {
      const body = await fs.readFile(path.join(dir, name), 'utf8')
      const job = JSON.parse(body)
      if (job?.bookingReference && !seenReferences.has(job.bookingReference)) {
        seenReferences.add(job.bookingReference)
        if (job.nextNotificationAttemptAt && new Date(job.nextNotificationAttemptAt).getTime() > Date.now()) continue
        if (!fallbackNotificationsComplete(job) && !Object.values(job.delivery || {}).some((entry) => shouldAttemptChannel(entry, true))) continue
        jobs.push(job)
      }
    } catch (error) {
      console.error(`Booking fallback queue read error (${name}):`, error)
    }
  }
  return jobs
}

function mergeFallbackDelivery(booking, result) {
  booking.delivery ||= {}
  const mapping = {
    companyEmail: 'companyEmail',
    customerEmail: 'customerEmail',
    customerWhatsApp: 'whatsappConfirmation',
    companyWhatsApp: 'companyWhatsApp',
  }

  for (const [channel, resultKey] of Object.entries(mapping)) {
    const status = result[resultKey]
    if (!status) continue
    const previous = booking.delivery[channel] || { status: 'pending', attempts: 0 }
    const wasAttempted = result.attemptedChannels?.includes(resultKey) || false
    booking.delivery[channel] = {
      ...previous,
      status,
      attempts: Number(previous.attempts || 0) + (wasAttempted ? 1 : 0),
      lastAttemptAt: wasAttempted ? new Date().toISOString() : previous.lastAttemptAt || null,
      lastError: wasAttempted ? clean(result.errors?.[resultKey]).slice(0, 1000) : previous.lastError || '',
    }
  }
  booking.nextNotificationAttemptAt = fallbackNotificationsComplete(booking)
    ? null : new Date(Date.now() + RETRY_AFTER_MS).toISOString()
  return booking
}

function notificationError(error) {
  const parts = [error?.code, error?.responseCode, error?.command, error?.message]
    .map((value) => clean(value))
    .filter(Boolean)
  return parts.join(' | ').slice(0, 1000)
}

function fallbackNotificationsComplete(booking) {
  return ['companyEmail', 'customerEmail', 'customerWhatsApp', 'companyWhatsApp'].every((channel) => {
    const status = booking.delivery?.[channel]?.status
    return status === 'sent' || status === 'not_requested'
  })
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
  if (String(process.env.BOOKING_FORCE_RETRY_FAILED || '').toLowerCase() === 'true') return true
  return Number(entry?.attempts || 0) < MAX_NOTIFICATION_ATTEMPTS
}

async function deliverNotifications(bookingDocOrObject, { onlyPending = false } = {}) {
  const booking = bookingDocOrObject?.toObject ? bookingDocOrObject.toObject() : bookingDocOrObject
  const smtpAvailable = getSmtpProviders().length > 0
  const { companyHtml, customerHtml, companyText, customerText, bookingTo } = emailContent(booking)
  const backupCompanyEmail = clean(process.env.BOOKING_ALERT_EMAIL)
  const companyRecipients = [...new Set([bookingTo, backupCompanyEmail].filter(Boolean))]
  const result = {
    companyEmail: smtpAvailable ? 'pending' : 'not_configured',
    customerEmail: smtpAvailable ? 'pending' : 'not_configured',
    whatsappConfirmation: booking.hasWhatsApp ? (customerWhatsappConfigured() ? 'pending' : 'not_configured') : 'not_requested',
    companyWhatsApp: booking.hasWhatsApp ? (companyWhatsappConfigured() ? 'pending' : 'not_configured') : 'not_requested',
    errors: {},
    attemptedChannels: [],
  }

  const currentDelivery = booking.delivery || {}

  if (smtpAvailable && shouldAttemptChannel(currentDelivery.companyEmail, onlyPending)) {
    result.attemptedChannels.push('companyEmail')
    try {
      await sendMailWithFallback((provider) => ({
        from: `"${provider.fromName}" <${provider.fromEmail}>`,
        to: companyRecipients,
        replyTo: booking.email,
        subject: `[${booking.bookingReference}] New reservation request: ${singleLine(booking.service)}`,
        html: companyHtml,
        text: companyText,
      }))
      result.companyEmail = 'sent'
      await updateDelivery(bookingDocOrObject, 'companyEmail', 'sent')
    } catch (error) {
      console.error('Company booking email error:', error)
      result.companyEmail = 'failed'
      result.errors.companyEmail = notificationError(error)
      await updateDelivery(bookingDocOrObject, 'companyEmail', 'failed', error.message)
    }
  } else if (onlyPending) {
    result.companyEmail = currentDelivery.companyEmail?.status || result.companyEmail
  }

  if (smtpAvailable && shouldAttemptChannel(currentDelivery.customerEmail, onlyPending)) {
    result.attemptedChannels.push('customerEmail')
    try {
      await sendMailWithFallback((provider) => ({
        from: `"${provider.fromName}" <${provider.fromEmail}>`,
        to: booking.email,
        replyTo: bookingTo,
        subject: `[${booking.bookingReference}] Your Tripscape reservation request was received`,
        html: customerHtml,
        text: customerText,
      }))
      result.customerEmail = 'sent'
      await updateDelivery(bookingDocOrObject, 'customerEmail', 'sent')
    } catch (error) {
      console.error('Customer confirmation email error:', error)
      result.customerEmail = 'failed'
      result.errors.customerEmail = notificationError(error)
      await updateDelivery(bookingDocOrObject, 'customerEmail', 'failed', error.message)
    }
  } else if (onlyPending) {
    result.customerEmail = currentDelivery.customerEmail?.status || result.customerEmail
  }

  if (booking.hasWhatsApp && customerWhatsappConfigured() && shouldAttemptChannel(currentDelivery.customerWhatsApp, onlyPending)) {
    result.attemptedChannels.push('whatsappConfirmation')
    try {
      const waResult = await sendWhatsAppTemplate({
        to: booking.phoneDigits,
        templateName: customerWhatsappTemplate(),
        parameters: [booking.name, booking.bookingReference, booking.service, booking.travelDate],
      })
      result.whatsappConfirmation = waResult.status
      await updateDelivery(bookingDocOrObject, 'customerWhatsApp', waResult.status)
    } catch (error) {
      console.error('Customer WhatsApp confirmation error:', error)
      result.whatsappConfirmation = 'failed'
      result.errors.whatsappConfirmation = notificationError(error)
      await updateDelivery(bookingDocOrObject, 'customerWhatsApp', 'failed', error.message)
    }
  } else if (booking.hasWhatsApp && onlyPending) {
    result.whatsappConfirmation = currentDelivery.customerWhatsApp?.status || result.whatsappConfirmation
  }

  if (booking.hasWhatsApp && companyWhatsappConfigured() && shouldAttemptChannel(currentDelivery.companyWhatsApp, onlyPending)) {
    result.attemptedChannels.push('companyWhatsApp')
    try {
      const companyWhatsAppTo = digits(process.env.BOOKING_WHATSAPP_TO || DEFAULT_BOOKING_WHATSAPP_TO)
      const companyWaResult = await sendWhatsAppTemplate({
        to: companyWhatsAppTo,
        templateName: companyWhatsappTemplate(),
        parameters: [
          booking.bookingReference,
          booking.name,
          booking.service,
          booking.travelDate,
          `${booking.countryCode} ${booking.phone}`.trim(),
          booking.email,
        ],
      })
      result.companyWhatsApp = companyWaResult.status
      await updateDelivery(bookingDocOrObject, 'companyWhatsApp', companyWaResult.status)
    } catch (error) {
      console.error('Company WhatsApp booking alert error:', error)
      result.companyWhatsApp = 'failed'
      result.errors.companyWhatsApp = notificationError(error)
      await updateDelivery(bookingDocOrObject, 'companyWhatsApp', 'failed', error.message)
    }
  } else if (booking.hasWhatsApp && onlyPending) {
    result.companyWhatsApp = currentDelivery.companyWhatsApp?.status || result.companyWhatsApp
  }

  if (bookingDocOrObject?._id && mongoose.connection.readyState === 1) {
    const retryNeeded = [result.companyEmail, result.customerEmail, result.whatsappConfirmation, result.companyWhatsApp]
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
    smtpPrimary: smtpProvider('SMTP') ? 'configured' : 'not_configured',
    smtpFallback: smtpProvider('SMTP_FALLBACK') ? 'configured' : 'not_configured',
    whatsappApi: whatsappApiConfigured() ? 'configured' : 'not_configured',
    customerWhatsApp: customerWhatsappConfigured() ? 'configured' : 'not_configured',
    companyWhatsApp: companyWhatsappConfigured() ? 'configured' : 'not_configured',
  })
})

// Public, anonymised feed of real recent bookings for the site's social-proof
// notifications. Only first name + last initial, tour title and time leave the server.
const RECENT_BOOKINGS_WINDOW_MS = 14 * 24 * 60 * 60 * 1000

function publicBookingName(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'A guest'
  const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase()
  return parts.length > 1 ? `${first} ${parts[parts.length - 1].charAt(0).toUpperCase()}.` : first
}

router.get('/recent', async (_req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json([])

  try {
    const bookings = await Booking.find({
      status: { $ne: 'cancelled' },
      createdAt: { $gte: new Date(Date.now() - RECENT_BOOKINGS_WINDOW_MS) },
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('name tourTitle createdAt')
      .lean()

    res.set('Cache-Control', 'public, max-age=60')
    res.json(bookings.map((booking) => ({
      name: publicBookingName(booking.name),
      tourTitle: booking.tourTitle,
      createdAt: booking.createdAt,
    })))
  } catch (error) {
    console.error('Recent bookings error:', error.message)
    res.json([])
  }
})

router.post('/', async (req, res) => {
  const normalized = normalizeBooking(req.body || {})
  const validationError = validateBooking(normalized)
  if (validationError) return res.status(400).json({ message: validationError })

  if (normalized.submissionId && mongoose.connection.readyState === 1) {
    const existing = await Booking.findOne({ submissionId: normalized.submissionId }).lean().catch(() => null)
    if (existing) {
      return res.status(200).json({
        message: 'Reservation request already received.',
        bookingReference: existing.bookingReference,
        storage: 'mongodb',
        duplicate: true,
        companyEmail: existing.delivery?.companyEmail?.status || 'pending',
        customerEmail: existing.delivery?.customerEmail?.status || 'pending',
        whatsappConfirmation: existing.delivery?.customerWhatsApp?.status || 'not_requested',
        companyWhatsApp: existing.delivery?.companyWhatsApp?.status || 'not_requested',
      })
    }
  }

  const bookingReference = makeBookingReference()
  let promoPricing = {}

  // Promo codes are single-use: mark the code as used before the booking is saved.
  if (normalized.promoCode) {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Promo codes are temporarily unavailable. Remove the code or try again shortly.' })
    }
    const promo = await redeemPromoCode(normalized.promoCode, normalized.tourTitle, bookingReference).catch(() => null)
    if (!promo) {
      return res.status(400).json({ message: 'This promo code is invalid, expired, already used, or not valid for this tour.' })
    }
    const aed = (amount) => `AED ${Math.round(amount).toLocaleString('en-US')}`
    promoPricing = {
      promoCode: promo.code,
      promoPercent: promo.percent,
      originalPrice: `${aed(promo.basePrice)}${promo.unit ? ` ${promo.unit}` : ''}`,
      price: `${aed(promo.basePrice * (1 - promo.percent / 100))}${promo.unit ? ` ${promo.unit}` : ''} (promo ${promo.code}, ${promo.percent}% off)`,
    }
  }

  const booking = {
    bookingReference,
    ...normalized,
    ...promoPricing,
    source: 'tripscapetourism.com',
    delivery: {
      companyEmail: { status: smtpConfigured() ? 'pending' : 'not_configured', attempts: 0 },
      customerEmail: { status: smtpConfigured() ? 'pending' : 'not_configured', attempts: 0 },
      customerWhatsApp: {
        status: normalized.hasWhatsApp
          ? (customerWhatsappConfigured() ? 'pending' : 'not_configured')
          : 'not_requested',
        attempts: 0,
      },
      companyWhatsApp: {
        status: normalized.hasWhatsApp
          ? (companyWhatsappConfigured() ? 'pending' : 'not_configured')
          : 'not_requested',
        attempts: 0,
      },
    },
    nextNotificationAttemptAt: new Date(Date.now() + RETRY_AFTER_MS),
  }

  let bookingDoc = null
  let storage = 'none'
  let duplicateBooking = false

  if (mongoose.connection.readyState === 1) {
    try {
      bookingDoc = await Booking.create(booking)
      storage = 'mongodb'
    } catch (error) {
      if (error?.code === 11000 && normalized.submissionId) {
        bookingDoc = await Booking.findOne({ submissionId: normalized.submissionId }).catch(() => null)
        if (bookingDoc) {
          storage = 'mongodb'
          duplicateBooking = true
        }
      } else {
        console.error('MongoDB booking save error:', error)
      }
    }
  }

  if (duplicateBooking && bookingDoc) {
    if (promoPricing.promoCode && bookingDoc.promoCode !== promoPricing.promoCode) await releasePromoCode(promoPricing.promoCode)
    return res.status(200).json({
      message: 'Reservation request already received.',
      bookingReference: bookingDoc.bookingReference,
      storage: 'mongodb',
      duplicate: true,
      companyEmail: bookingDoc.delivery?.companyEmail?.status || 'pending',
      customerEmail: bookingDoc.delivery?.customerEmail?.status || 'pending',
      whatsappConfirmation: bookingDoc.delivery?.customerWhatsApp?.status || 'not_requested',
      companyWhatsApp: bookingDoc.delivery?.companyWhatsApp?.status || 'not_requested',
    })
  }

  if (!bookingDoc) {
    try {
      await appendFallbackBooking(booking)
      await persistFallbackQueueJob(booking)
      storage = 'file_fallback'
    } catch (error) {
      console.error('Fallback booking save error:', error)
    }
  }

  if (storage === 'none') {
    if (promoPricing.promoCode) await releasePromoCode(promoPricing.promoCode)
    return res.status(503).json({
      message: 'We could not safely store your reservation request right now. Please try again or contact our booking team by phone or WhatsApp.',
    })
  }

  const delivery = await deliverNotifications(bookingDoc || booking)

  if (!bookingDoc && storage === 'file_fallback') {
    mergeFallbackDelivery(booking, delivery)
    if (fallbackNotificationsComplete(booking)) {
      await removeFallbackQueueJob(booking.bookingReference).catch((error) => console.error('Fallback queue cleanup error:', error))
    } else {
      await persistFallbackQueueJob(booking).catch((error) => console.error('Fallback queue update error:', error))
    }
  }

  return res.status(201).json({
    message: 'Reservation request saved successfully.',
    bookingReference: bookingDoc?.bookingReference || booking.bookingReference,
    storage,
    companyEmail: delivery.companyEmail,
    customerEmail: delivery.customerEmail,
    whatsappConfirmation: delivery.whatsappConfirmation,
    companyWhatsApp: delivery.companyWhatsApp,
  })
})

let workerStarted = false

export function startBookingNotificationWorker() {
  if (workerStarted) return
  workerStarted = true

  let running = false
  const processJobs = async () => {
    try {
      const fallbackJobs = await readFallbackQueueJobs(20)
      for (const fallbackJob of fallbackJobs) {
        const result = await deliverNotifications(fallbackJob, { onlyPending: true })
        mergeFallbackDelivery(fallbackJob, result)
        if (fallbackNotificationsComplete(fallbackJob)) {
          await removeFallbackQueueJob(fallbackJob.bookingReference)
        } else {
          await persistFallbackQueueJob(fallbackJob)
        }
      }
    } catch (error) {
      console.error('Booking fallback notification worker error:', error)
    }

    if (mongoose.connection.readyState !== 1) return
    try {
      const now = new Date()
      const bookings = await Booking.find({
        nextNotificationAttemptAt: { $ne: null, $lte: now },
        $or: [
          { 'delivery.companyEmail.status': { $in: ['pending', 'failed', 'not_configured'] } },
          { 'delivery.customerEmail.status': { $in: ['pending', 'failed', 'not_configured'] } },
          { 'delivery.customerWhatsApp.status': { $in: ['pending', 'failed', 'not_configured'] } },
          { 'delivery.companyWhatsApp.status': { $in: ['pending', 'failed', 'not_configured'] } },
        ],
      }).sort({ createdAt: 1 }).limit(20)

      for (const booking of bookings) {
        const maxAttemptsReached = ['companyEmail', 'customerEmail', 'customerWhatsApp', 'companyWhatsApp'].every((channel) => {
          const entry = booking.delivery?.[channel]
          return !shouldAttemptChannel(entry, true)
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

  const run = async () => {
    if (running) return
    running = true
    try { await processJobs() } finally { running = false }
  }
  setTimeout(run, 15000).unref?.()
  const timer = setInterval(run, Math.max(RETRY_INTERVAL_MS, 60000))
  timer.unref?.()
}

export default router
