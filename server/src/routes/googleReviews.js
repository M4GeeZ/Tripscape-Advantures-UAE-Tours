import express from 'express'

const router = express.Router()

const STAR_VALUES = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
}

let tokenCache = { value: null, expiresAt: 0 }
let reviewsCache = { value: null, expiresAt: 0 }

function envReady() {
  return Boolean(
    process.env.GOOGLE_BUSINESS_ACCOUNT_ID &&
    process.env.GOOGLE_BUSINESS_LOCATION_ID &&
    process.env.GOOGLE_OAUTH_CLIENT_ID &&
    process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN
  )
}

async function getAccessToken() {
  if (tokenCache.value && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.value
  }

  const body = new URLSearchParams({
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  })

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  const data = await response.json()
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Could not refresh Google access token.')
  }

  tokenCache = {
    value: data.access_token,
    expiresAt: Date.now() + Math.max(60, Number(data.expires_in || 3600)) * 1000,
  }
  return tokenCache.value
}

async function getAllReviews(accessToken) {
  const accountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID
  const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID
  const base = `https://mybusiness.googleapis.com/v4/accounts/${encodeURIComponent(accountId)}/locations/${encodeURIComponent(locationId)}/reviews`

  let pageToken = ''
  let reviews = []
  let averageRating = 0
  let totalReviewCount = 0
  let pages = 0

  do {
    const url = new URL(base)
    url.searchParams.set('pageSize', '50')
    url.searchParams.set('orderBy', 'rating desc')
    if (pageToken) url.searchParams.set('pageToken', pageToken)

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.error?.message || 'Could not load Google Business Profile reviews.')
    }

    reviews.push(...(data.reviews || []))
    averageRating = Number(data.averageRating || averageRating || 0)
    totalReviewCount = Number(data.totalReviewCount || totalReviewCount || reviews.length)
    pageToken = data.nextPageToken || ''
    pages += 1
  } while (pageToken && pages < 50)

  return { reviews, averageRating, totalReviewCount }
}

function selectBestSix(reviews) {
  return reviews
    .map((review) => ({
      id: review.reviewId || review.name || `${review.reviewer?.displayName || 'google'}-${review.updateTime || ''}`,
      author: review.reviewer?.displayName || 'Google reviewer',
      profilePhotoUrl: review.reviewer?.profilePhotoUrl || '',
      rating: STAR_VALUES[review.starRating] || Number(review.starRating) || 0,
      comment: String(review.comment || '').trim(),
      createTime: review.createTime || '',
      updateTime: review.updateTime || review.createTime || '',
    }))
    // Original Google reviews only; prefer high-rated reviews that contain useful written feedback.
    .filter((review) => review.rating >= 4 && review.comment.length >= 20)
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating
      const dateDiff = new Date(b.updateTime || 0) - new Date(a.updateTime || 0)
      if (dateDiff) return dateDiff
      return b.comment.length - a.comment.length
    })
    .slice(0, 6)
}

router.get('/', async (_req, res) => {
  if (!envReady()) {
    return res.status(503).json({
      configured: false,
      message: 'Google Business Profile reviews are not configured yet.',
      reviews: [],
    })
  }

  const cacheMs = Math.max(60_000, Number(process.env.GOOGLE_REVIEWS_CACHE_MS || 900_000))
  if (reviewsCache.value && reviewsCache.expiresAt > Date.now()) {
    return res.json(reviewsCache.value)
  }

  try {
    const token = await getAccessToken()
    const { reviews, averageRating, totalReviewCount } = await getAllReviews(token)
    const selected = selectBestSix(reviews)

    const payload = {
      configured: true,
      source: 'Google',
      averageRating,
      totalReviewCount,
      reviewsUrl: process.env.GOOGLE_REVIEWS_URL || '',
      reviews: selected,
    }

    reviewsCache = { value: payload, expiresAt: Date.now() + cacheMs }
    res.json(payload)
  } catch (error) {
    console.error('Google reviews error:', error.message)
    res.status(502).json({
      configured: true,
      message: 'Google reviews are temporarily unavailable.',
      reviews: [],
    })
  }
})

export default router
