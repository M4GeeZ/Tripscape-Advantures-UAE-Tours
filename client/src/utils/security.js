import crypto from 'node:crypto'

const TOKEN_COOKIE = 'tripscape_admin'
const TOKEN_TTL_SECONDS = 60 * 60 * 12

function timingSafeEqualText(a, b) {
  const left = Buffer.from(String(a))
  const right = Buffer.from(String(b))
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex')
  return `scrypt$${salt}$${hash}`
}

export function verifyPassword(password, stored) {
  const [scheme, salt, expected] = String(stored || '').split('$')
  if (scheme !== 'scrypt' || !salt || !expected) return false
  try {
    const actual = crypto.scryptSync(String(password), salt, 64).toString('hex')
    return timingSafeEqualText(actual, expected)
  } catch {
    return false
  }
}

export function createAdminToken(email) {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not configured.')
  const now = Math.floor(Date.now() / 1000)
  const payload = { sub: 'admin', email, iat: now, exp: now + TOKEN_TTL_SECONDS }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(encoded).digest('base64url')
  return `${encoded}.${signature}`
}

export function verifyAdminToken(token) {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || !token) return null
  const [encoded, signature] = String(token).split('.')
  if (!encoded || !signature) return null
  const expected = crypto.createHmac('sha256', secret).update(encoded).digest('base64url')
  if (!timingSafeEqualText(expected, signature)) return null
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
    if (payload.sub !== 'admin' || !payload.email || Number(payload.exp) <= Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export function setAdminCookie(res, token) {
  const secure = process.env.NODE_ENV === 'production' || String(res.req?.headers?.['x-forwarded-proto'] || '').split(',')[0].trim() === 'https'
  res.setHeader('Set-Cookie', `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TOKEN_TTL_SECONDS}${secure ? '; Secure' : ''}`)
}

export function clearAdminCookie(res) {
  const secure = process.env.NODE_ENV === 'production' || String(res.req?.headers?.['x-forwarded-proto'] || '').split(',')[0].trim() === 'https'
  res.setHeader('Set-Cookie', `${TOKEN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`)
}

export function readCookie(req, name) {
  const raw = req.headers.cookie || ''
  for (const pair of raw.split(';')) {
    const [key, ...rest] = pair.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return ''
}

export function requireAdmin(req, res, next) {
  const payload = verifyAdminToken(readCookie(req, TOKEN_COOKIE))
  if (!payload) return res.status(401).json({ message: 'Authentication required.' })
  req.admin = payload
  return next()
}

export function adminConfigReady() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET)
}
