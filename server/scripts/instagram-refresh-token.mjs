// Renews the Instagram access token (valid for 60 days; renewing gives another 60).
// Run it every ~45 days:   cd server && npm run instagram:refresh
// Then copy the printed token into server/.env as INSTAGRAM_ACCESS_TOKEN and restart the server.
import '../src/config/env.js'

const token = process.env.INSTAGRAM_ACCESS_TOKEN
if (!token) {
  console.error('INSTAGRAM_ACCESS_TOKEN is not set in server/.env')
  process.exit(1)
}

const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`
const response = await fetch(url)
const body = await response.json().catch(() => ({}))
if (!response.ok || !body.access_token) {
  console.error('Could not renew the token:', body?.error?.message || response.status)
  console.error('If it already expired, generate a new one in the Meta developer dashboard (Instagram > API setup).')
  process.exit(1)
}
console.log('New token (valid for', Math.round((body.expires_in || 0) / 86400), 'days):')
console.log(body.access_token)
console.log('\nPaste it into server/.env as INSTAGRAM_ACCESS_TOKEN=... and restart the server.')
