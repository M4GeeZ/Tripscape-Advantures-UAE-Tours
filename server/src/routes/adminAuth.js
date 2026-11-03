import { Router } from 'express'
import { adminConfigReady, clearAdminCookie, createAdminToken, requireAdmin, setAdminCookie, verifyPassword } from '../utils/security.js'
import { adminRateLimit } from '../middleware/security.js'

const router = Router()

router.post('/login', adminRateLimit, (req, res) => {
  if (!adminConfigReady()) return res.status(503).json({ message: 'Admin authentication is not configured on the server.' })

  const email = String(req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')
  const expectedEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase()

  if (email !== expectedEmail || !verifyPassword(password, process.env.ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({ message: 'Invalid admin credentials.' })
  }

  const token = createAdminToken(expectedEmail)
  setAdminCookie(res, token)
  return res.json({ authenticated: true, email: expectedEmail })
})

router.post('/logout', (_req, res) => {
  clearAdminCookie(res)
  res.json({ authenticated: false })
})

router.get('/me', requireAdmin, (req, res) => {
  setAdminCookie(res, createAdminToken(req.admin.email)) // TRIPSCAPE_REFRESH_SESSION_COOKIE
  res.json({ authenticated: true, email: req.admin.email })
})

export default router
