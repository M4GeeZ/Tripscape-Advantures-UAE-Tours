import { Router } from 'express'

/*
  Instagram feed for the website ("Fresh from Instagram" section on tour pages).
  Uses Instagram's official API with the account's own access token, so no scraping.

  Setup (once): put INSTAGRAM_ACCESS_TOKEN in server/.env  (see server/.env.example).
  The token lasts 60 days; renew it with `npm run instagram:refresh` (from the server folder).
  Without a token this endpoint returns an empty list and the section stays hidden.
*/
const router = Router()

const API_BASE = (process.env.INSTAGRAM_API_BASE || 'https://graph.instagram.com').replace(/\/+$/, '')
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'
const PAGE_SIZE = 50
const MAX_PAGES = 12 // up to 600 posts are scanned for videos
const CACHE_MS = 15 * 60 * 1000
const USERNAME = process.env.INSTAGRAM_USERNAME || 'tripscapeadventures'

let cache = { at: 0, items: [] }
let inFlight = null
let lastError = ''

async function fetchJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(12000) })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body?.error?.message || `Instagram API responded ${response.status}`)
  return body
}

// Every video and reel on the account, newest first.
async function loadVideos(token) {
  const items = []
  let url = `${API_BASE}/me/media?fields=${FIELDS}&limit=${PAGE_SIZE}&access_token=${encodeURIComponent(token)}`
  for (let page = 0; page < MAX_PAGES && url; page += 1) {
    const body = await fetchJson(url)
    for (const media of body.data || []) {
      if (media.media_type !== 'VIDEO') continue // reels and videos only (no photos)
      items.push({
        id: String(media.id),
        permalink: media.permalink || '',
        thumbnail: media.thumbnail_url || '',
        videoUrl: media.media_url || '',
        caption: String(media.caption || '').replace(/\s+/g, ' ').trim().slice(0, 140),
        timestamp: media.timestamp || '',
      })
    }
    url = body.paging?.next || ''
  }
  return items
}

async function getVideos(token) {
  if (cache.items.length && Date.now() - cache.at < CACHE_MS) return cache.items
  if (!inFlight) {
    inFlight = loadVideos(token)
      .then((items) => {
        cache = { at: Date.now(), items }
        lastError = ''
        return items
      })
      .catch((error) => {
        // Keep showing the last good result if Instagram is temporarily unavailable.
        if (lastError !== error.message) console.error('Instagram feed error:', error.message)
        lastError = error.message
        return cache.items
      })
      .finally(() => { inFlight = null })
  }
  return inFlight
}

router.get('/', async (_req, res) => {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  res.set('Cache-Control', 'public, max-age=300')
  if (!token) return res.json({ configured: false, username: USERNAME, items: [] })
  const items = await getVideos(token)
  return res.json({ configured: true, username: USERNAME, items })
})

export default router
