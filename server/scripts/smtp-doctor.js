import 'dotenv/config'
import nodemailer from 'nodemailer'

const clean = (v = '') => String(v ?? '').trim()
const normalizePassword = (host, value = '') => clean(host).toLowerCase().includes('gmail.com')
  ? String(value ?? '').replace(/\s+/g, '')
  : String(value ?? '').trim()

function config(prefix) {
  const host = clean(process.env[`${prefix}_HOST`])
  const port = Number(process.env[`${prefix}_PORT`] || 465)
  const secure = String(process.env[`${prefix}_SECURE`] ?? port === 465).toLowerCase() === 'true'
  const user = clean(process.env[`${prefix}_USER`])
  const pass = normalizePassword(host, process.env[`${prefix}_PASS`])
  const authMethod = clean(process.env[`${prefix}_AUTH_METHOD`])
  if (!host || !user || !pass) return null
  return { prefix, host, port, secure, user, pass, authMethod }
}

async function verify(cfg) {
  const options = {
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  }
  if (cfg.authMethod) options.authMethod = cfg.authMethod
  const transporter = nodemailer.createTransport(options)
  try {
    await transporter.verify()
    console.log(`✅ ${cfg.prefix} LOGIN OK — ${cfg.user} via ${cfg.host}:${cfg.port}`)
    return true
  } catch (error) {
    console.log(`❌ ${cfg.prefix} LOGIN FAILED — ${cfg.user} via ${cfg.host}:${cfg.port}`)
    console.log(`${error.code || ''} ${error.response || error.message || ''}`.trim())
    return false
  }
}

const configs = [config('SMTP'), config('SMTP_FALLBACK')].filter(Boolean)
if (!configs.length) {
  console.log('❌ No SMTP credentials found in server/.env')
  process.exitCode = 1
} else {
  const results = []
  for (const cfg of configs) results.push(await verify(cfg))
  if (!results.some(Boolean)) process.exitCode = 1
}
