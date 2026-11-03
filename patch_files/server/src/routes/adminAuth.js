import { Router } from 'express'
import { adminConfigReady, clearAdminCookie, createAdminToken, requireAdmin, setAdminCookie, verifyPassword } from '../utils/security.js'
import { adminRateLimit, clearAdminLoginFailures, recordAdminLoginFailure } from '../middleware/security.js'

const router = Router()

// Publicly exposes only whether the admin auth module is installed/configured.
// It never returns credentials, hashes or secrets. This makes production deploys easy to verify.
router.get('/health', (_req, res) => {
  res.json({ ok: true, configured: adminConfigReady() })
})

router.post('/login', adminRateLimit, (req, res) => {
  if (!adminConfigReady()) return res.status(503).json({ message: 'Admin authentication is not configured on the server.' })

  const email = String(req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')
  const expectedEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase()

  if (email !== expectedEmail || !verifyPassword(password, process.env.ADMIN_PASSWORD_HASH)) {
    recordAdminLoginFailure(req)
    return res.status(401).json({ message: 'Invalid admin credentials.' })
  }

  // A valid login clears previous failed-attempt history for this client.
  clearAdminLoginFailures(req)
  const token = createAdminToken(expectedEmail)
  setAdminCookie(res, token)
  return res.json({ authenticated: true, email: expectedEmail })
})

router.post('/logout', (_req, res) => {
  clearAdminCookie(res)
  res.json({ authenticated: false })
})

router.get('/me', requireAdmin, (req, res) => {
  res.json({ authenticated: true, email: req.admin.email })
})

export default router
