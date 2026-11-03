import { useEffect } from 'react'
import { seoMetaByPath } from './seoMeta'
import { apiUrl } from './utils/apiBaseUrl'
import { resolveSchema, writePageSchema } from './utils/schemaManager'

function putMeta(name, content, property = false) {
  if (content == null || content === '') return
  const attr = property ? 'property' : 'name'
  let node = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!node) { node = document.createElement('meta'); node.setAttribute(attr, name); document.head.appendChild(node) }
  node.content = content
}
function putCanonical(href) {
  if (!href) return
  let node = document.head.querySelector('link[rel="canonical"]')
  if (!node) { node = document.createElement('link'); node.rel = 'canonical'; document.head.appendChild(node) }
  node.href = href
}
function applyMeta(meta, path) {
  if (!meta) return
  const title = meta.seoTitle || meta.title
  const description = meta.metaDescription || meta.description
  if (title) document.title = title
  putMeta('description', description)
  putMeta('robots', meta.robots || 'index,follow')
  putCanonical(meta.canonical || `https://tripscapetourism.com${path}`)
  putMeta('og:title', title, true)
  putMeta('og:description', description, true)
  putMeta('og:url', meta.canonical || `https://tripscapetourism.com${path}`, true)
  putMeta('og:type', meta.ogType || 'website', true)
  putMeta('twitter:card', meta.twitterCard || 'summary_large_image')
  putMeta('twitter:title', title)
  putMeta('twitter:description', description)
}

export default function SeoHead() {
  useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, '') || '/'
    const isStandardTour = /^\/tours\/[^/]+\/[^/]+$/.test(path) && ![
      '/tours/desert-safari/vip-private-desert-safari-family-package',
      '/tours/desert-adventures/desert-e-jet-water-go-kart-dubai',
      '/tours/desert-safari/private-desert-safari-packages'
    ].includes(path)
    const isBlogDetail = /^\/blog\/[^/]+$/.test(path)
    // Standard detail pages load their specific CMS metadata and schema, not a sitewide fallback.
    if (isStandardTour || isBlogDetail) return
    const local = seoMetaByPath[path] || null
    if (local) {
      applyMeta(local, path)
      writePageSchema(resolveSchema(local, 'page', path, local.schema || null))
    }
    let alive = true
    fetch(apiUrl(`/api/seo?path=${encodeURIComponent(path)}`))
      .then(res => res.ok ? res.json() : null)
      .then(override => {
        if (!alive || !override) return
        applyMeta({ ...local, ...override }, path)
        writePageSchema(resolveSchema({ ...local, ...override, title: override.seoTitle || local?.title }, 'page', path, local?.schema || null))
      })
      .catch(() => {})
    return () => {alive = false}
  }, [])
  return null
}
