function trimTrailingSlash(value = '') {
  return String(value || '').trim().replace(/\/+$/, '')
}

export function getApiBaseUrl() {
  const configured = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL)
  if (configured) return configured

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname.toLowerCase()

    // Local Vite development uses vite.config.js -> localhost:5000 proxy.
    if (hostname === 'localhost' || hostname === '127.0.0.1') return ''

    // Staging frontend is hosted on Vercel while the long-running API lives on the VPS.
    if (hostname.endsWith('.vercel.app')) return 'https://tripscapetourism.com'
  }

  // Production is served from the same host, so same-origin /api is the most reliable path.
  return ''
}

export function apiUrl(pathname) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${getApiBaseUrl()}${path}`
}

export function mediaUrl(value) {
  const source = String(value || '').trim()
  if (!source) return ''
  if (/^data:image\//i.test(source)) return source
  if (/^https?:\/\//i.test(source)) return source
  if (source.startsWith('/api/uploads/')) return apiUrl(source)
  if (source.startsWith('/uploads/')) return apiUrl(`/api${source}`)
  return source
}
