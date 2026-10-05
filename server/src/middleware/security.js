import { requireAdmin } from '../utils/security.js'

const attempts = new Map()

export function securityHeaders(_req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  return next()
}

export function adminRateLimit(req, res, next) {
  const key = req.ip || req.socket.remoteAddress || 'unknown'
  const now = Date.now()
  const current = attempts.get(key) || { count: 0, resetAt: now + 15 * 60 * 1000 }
  if (current.resetAt <= now) {
    current.count = 0
    current.resetAt = now + 15 * 60 * 1000
  }
  current.count += 1
  attempts.set(key, current)
  if (current.count > 10) return res.status(429).json({ message: 'Too many login attempts. Please try again later.' })
  return next()
}

export { requireAdmin }
