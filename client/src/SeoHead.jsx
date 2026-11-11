import { useEffect } from 'react'
import { isMetaClaimed } from './utils/metaOwner'
import { apiUrl } from './utils/apiBaseUrl'
import { resolveSchema, writePageSchema } from './utils/schemaManager'
import { setCanonical } from './utils/canonical'

function putMeta(name, content, property = false) {
  if (content == null || content === '') return
  const attr = property ? 'property' : 'name'
  let node = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!node) { node = document.createElement('meta'); node.setAttribute(attr, name); document.head.appendChild(node) }
  node.content = content
}
export function applyMeta(meta, path) {
  if (!meta) return
  const title = meta.seoTitle || meta.title
  const description = meta.metaDescription || meta.description
  if (title) document.title = title
  putMeta('description', description)
  putMeta('robots', meta.robots || 'index,follow')
  const canonical = setCanonical(meta.canonical || path)
  putMeta('og:title', title, true)
  putMeta('og:description', description, true)
  putMeta('og:url', canonical, true)
  putMeta('og:type', meta.ogType || 'website', true)
  putMeta('twitter:card', meta.twitterCard || 'summary_large_image')
  putMeta('twitter:title', title)
  putMeta('twitter:description', description)
}

// The page's own title, description and canonical, applied on top of the sitewide data.
function withCurrentPageMeta(local) {
  return {
    ...local,
    seoTitle: '',
    title: document.title,
    metaDescription: '',
    description: document.head.querySelector('meta[name="description"]')?.content || local.description,
    canonical: document.head.querySelector('link[rel="canonical"]')?.href || local.canonical,
  }
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
    let alive = true
    // seoMeta.js is large (every page's title and schema), so it is loaded after the page is shown.
    import('./seoMeta').then(({ seoMetaByPath }) => {
      if (!alive) return
      const local = seoMetaByPath[path] || null
      if (local) {
        // A page that sets its own title, description and canonical keeps them.
        applyMeta(isMetaClaimed(path) ? withCurrentPageMeta(local) : local, path)
        writePageSchema(resolveSchema(local, 'page', path, local.schema || null))
      }
      fetch(apiUrl(`/api/seo?path=${encodeURIComponent(path)}`))
        .then(res => res.ok ? res.json() : null)
        .then(override => {
          if (!alive || !override) return
          applyMeta({ ...local, ...override }, path)
          writePageSchema(resolveSchema({ ...local, ...override, title: override.seoTitle || local?.title }, 'page', path, local?.schema || null))
        })
        .catch(() => {})
    }).catch(() => {})
    return () => {alive = false}
  }, [])
  return null
}
