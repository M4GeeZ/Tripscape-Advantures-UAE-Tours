const SITE_ORIGIN = 'https://tripscapetourism.com'

/*
  One rule for every canonical URL on the site.
  The live server redirects /tours/x to /tours/x/ (trailing slash), and the static HTML
  generated at build time already uses the slash. Setting a slash-less canonical in the
  browser made the raw HTML and the rendered page disagree, so every canonical now
  uses the same form: production origin + path + trailing slash.
*/
export function canonicalUrl(input) {
  const source = String(input || '').trim()
  if (!source) return ''
  let url
  try {
    url = new URL(source, SITE_ORIGIN)
  } catch {
    return ''
  }
  // Pages hosted on the site itself always canonicalise to the production domain.
  if (/\.vercel\.app$|^localhost$|^127\.0\.0\.1$/.test(url.hostname)) url = new URL(url.pathname, SITE_ORIGIN)
  let pathname = url.pathname
  if (!pathname.endsWith('/') && !/\.[a-z0-9]{2,5}$/i.test(pathname.split('/').pop() || '')) pathname += '/'
  return `${url.origin}${pathname}`
}

export function setCanonical(href) {
  const value = canonicalUrl(href)
  if (!value || typeof document === 'undefined') return value
  let node = document.head.querySelector('link[rel="canonical"]')
  if (!node) {
    node = document.createElement('link')
    node.rel = 'canonical'
    document.head.appendChild(node)
  }
  node.href = value
  return value
}
