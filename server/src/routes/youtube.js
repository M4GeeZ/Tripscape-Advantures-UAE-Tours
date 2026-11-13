import { Router } from 'express'

// GET /api/youtube -> every public video / Short of the Tripscape YouTube channel (same data as the Vercel function api/youtube.js).
// Needs YOUTUBE_API_KEY in server/.env (YouTube Data API v3 key).
const router = Router()
const HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE || 'TripscapeAdventuresTourism'
const API = 'https://www.googleapis.com/youtube/v3'
const CACHE_MS = 30 * 60 * 1000

let cache = null
let inflight = null

async function getJson(path, params, key) {
  const response = await fetch(`${API}/${path}?${new URLSearchParams({ ...params, key })}`)
  if (!response.ok) throw new Error(`YouTube API ${response.status}`)
  return response.json()
}

async function loadVideos(key) {
  const channel = await getJson('channels', { part: 'contentDetails', forHandle: HANDLE.replace(/^@/, '') }, key)
  const uploads = channel.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploads) return []
  const items = []
  let pageToken = ''
  for (let page = 0; page < 40; page += 1) {
    const data = await getJson('playlistItems', { part: 'snippet,status', playlistId: uploads, maxResults: '50', ...(pageToken ? { pageToken } : {}) }, key)
    for (const row of data.items || []) {
      const id = row.snippet?.resourceId?.videoId
      const title = row.snippet?.title || ''
      if (!id || title === 'Private video' || title === 'Deleted video') continue
      if (row.status?.privacyStatus && row.status.privacyStatus !== 'public') continue
      items.push({ id, title: title.slice(0, 120), thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, publishedAt: row.snippet?.publishedAt || '' })
    }
    pageToken = data.nextPageToken || ''
    if (!pageToken) break
  }
  return items
}

router.get('/', async (_req, res) => {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) return res.json({ configured: false, channel: HANDLE, items: [] })
  if (cache && Date.now() - cache.at < CACHE_MS) return res.json({ configured: true, channel: HANDLE, items: cache.items })
  try {
    inflight ||= loadVideos(key).finally(() => { inflight = null })
    const items = await inflight
    cache = { at: Date.now(), items }
    res.json({ configured: true, channel: HANDLE, items })
  } catch (error) {
    console.warn('youtube feed failed:', error.message)
    res.json({ configured: true, channel: HANDLE, items: cache?.items || [] })
  }
})

export default router
