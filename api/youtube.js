// Vercel serverless function: GET /api/youtube -> every public video / Short of the Tripscape YouTube channel.
// Needs the environment variable YOUTUBE_API_KEY (YouTube Data API v3 key) in the Vercel project settings.
const HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE || 'TripscapeAdventuresTourism'
const API = 'https://www.googleapis.com/youtube/v3'

async function getJson(path, params, key) {
  const url = `${API}/${path}?${new URLSearchParams({ ...params, key })}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`YouTube API ${response.status}`)
  return response.json()
}

async function loadVideos(key) {
  const channel = await getJson('channels', { part: 'contentDetails,snippet', forHandle: HANDLE.replace(/^@/, '') }, key)
  const found = channel.items?.[0]
  const uploads = found?.contentDetails?.relatedPlaylists?.uploads
  if (!uploads) return { channel: HANDLE, items: [] }

  const items = []
  let pageToken = ''
  for (let page = 0; page < 40; page += 1) { // 40 x 50 = 2000 videos at most
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
  return { channel: HANDLE, items }
}

module.exports = async function handler(_req, res) {
  const key = process.env.YOUTUBE_API_KEY
  // Cached on Vercel's edge for 30 minutes (and served stale while refreshing) to save API quota.
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400')
  if (!key) return res.status(200).json({ configured: false, channel: HANDLE, items: [] })
  try {
    res.status(200).json({ configured: true, ...(await loadVideos(key)) })
  } catch (error) {
    console.error('youtube feed failed:', error.message)
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({ configured: true, channel: HANDLE, items: [] })
  }
}
