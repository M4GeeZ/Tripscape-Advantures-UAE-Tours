export function normalizeSeoPath(value) {
  let path = String(value || '').trim()
  if (/^https?:\/\//.test(path)) {
    try { const url = new URL(path); if (!['tripscapetourism.com','www.tripscapetourism.com'].includes(url.hostname)) return null; path = url.pathname } catch { return null }
  }
  if (!path.startsWith('/') || path.includes('?') || path.includes('#') || path.includes('\\') || path.length > 500 || /[<>\x00-\x1f]/.test(path) || path.startsWith('//')) return null
  return path.replace(/\/+/g, '/').replace(/\/+$/, '') || '/'
}
