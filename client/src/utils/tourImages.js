import { useSyncExternalStore } from 'react'
import { apiUrl, mediaUrl } from './apiBaseUrl'

/*
  Tour photos managed in the admin panel (up to 10 per tour, in order).
    Image 1  -> every card for that tour + the hero background on its page
    Image 2  -> the intro photo on its page
    Image 3–10 -> the gallery on its page, in the same order
  The admin data is loaded once from /api/tours and matched by tour title or slug.
  If the API is unavailable, components keep their built-in images.
*/
export const MAX_TOUR_IMAGES = 10

const normalize = (text) => String(text || '').normalize('NFKC').toLowerCase()
  .replace(/[–—−]/g, '-').replace(/[^a-z0-9]+/g, ' ').trim()

const slugify = (text) => normalize(text).replace(/\s+/g, '-')

export function orderedImages(image, gallery = []) {
  const seen = new Set()
  return [image, ...(Array.isArray(gallery) ? gallery : [])]
    .map((src) => String(src || '').trim())
    .filter((src) => src && !seen.has(src) && seen.add(src))
    .slice(0, MAX_TOUR_IMAGES)
}

let byKey = new Map()
let loaded = false
let loading = null
const listeners = new Set()

function load() {
  if (loading || typeof window === 'undefined') return
  loading = fetch(apiUrl('/api/tours'))
    .then((res) => (res.ok ? res.json() : []))
    .then((tours) => {
      const next = new Map()
      ;(Array.isArray(tours) ? tours : []).forEach((tour) => {
        if (!tour?._id) return // only tours saved in the admin panel
        const images = orderedImages(tour.image, tour.gallery).map(mediaUrl)
        if (!images.length) return
        next.set(`t:${normalize(tour.title)}`, images)
        if (tour.slug) next.set(`s:${tour.slug}`, images)
      })
      byKey = next
    })
    .catch(() => {})
    .finally(() => {
      loaded = true
      listeners.forEach((listener) => listener())
    })
}

function subscribe(listener) {
  listeners.add(listener)
  load()
  return () => listeners.delete(listener)
}

export function getTourImages(title, slug) {
  return byKey.get(`t:${normalize(title)}`) || (slug && byKey.get(`s:${slug}`)) || byKey.get(`s:${slugify(title)}`) || null
}

// Re-renders when admin images arrive; use with getTourImages() inside lists.
export function useTourImageIndex() {
  return useSyncExternalStore(subscribe, () => byKey, () => byKey)
}

// Admin images for a tour (array, image 1 first) or null when none are set.
export function useTourImages(title, slug) {
  useTourImageIndex()
  return getTourImages(title, slug)
}

// Image 1 for a card, falling back to the card's own image.
export function useTourCardImage(title, fallback, slug) {
  const images = useTourImages(title, slug)
  return images?.[0] || fallback
}

export const tourImagesLoaded = () => loaded
