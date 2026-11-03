import { requireAdmin } from '../utils/security.js'

const attempts = new Map()
const ADMIN_LOGIN_WINDOW_MS = 15 * 60 * 1000
const ADMIN_LOGIN_MAX_FAILURES = 10

function attemptKey(req) {
  return req.ip || req.socket.remoteAddress || 'unknown'
}

function freshAttemptWindow(now = Date.now()) {
  return { count: 0, resetAt: now + ADMIN_LOGIN_WINDOW_MS }
}

export function securityHeaders(_req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  return next()
}

// This middleware only checks whether an IP is currently blocked. Failed
// credentials are counted explicitly by recordAdminLoginFailure(). That means
// successful logins, server restarts and temporary backend/database issues do
// not accidentally consume the admin's login allowance.
export function adminRateLimit(req, res, next) {
  const key = attemptKey(req)
  const now = Date.now()
  let current = attempts.get(key)
  if (current && current.resetAt <= now) {
    attempts.delete(key)
    current = null
  }
  if (current && current.count >= ADMIN_LOGIN_MAX_FAILURES) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    res.setHeader('Retry-After', String(retryAfter))
    return res.status(429).json({ message: 'Too many incorrect login attempts. Please wait a few minutes and try again.' })
  }
  return next()
}

export function recordAdminLoginFailure(req) {
  const key = attemptKey(req)
  const now = Date.now()
  let current = attempts.get(key)
  if (!current || current.resetAt <= now) current = freshAttemptWindow(now)
  current.count += 1
  attempts.set(key, current)
}

export function clearAdminLoginFailures(req) {
  attempts.delete(attemptKey(req))
}

export { requireAdmin }
