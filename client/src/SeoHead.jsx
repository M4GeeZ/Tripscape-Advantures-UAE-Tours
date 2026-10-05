import { useEffect } from 'react'
import { seoMetaByPath } from './seoMeta'

function upsertMeta({ name, property, content }) {
  const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    if (name) el.setAttribute('name', name)
    if (property) el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content || '')
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertSchema(schema) {
  if (!schema) return
  let el = document.head.querySelector('#tripscape-seo-schema')
  if (!el) {
    el = document.createElement('script')
    el.id = 'tripscape-seo-schema'
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(schema)
}

export default function SeoHead() {
  useEffect(() => {
    const path = `${window.location.pathname}`.replace(/\/+$/, '') || '/'
    const seo = seoMetaByPath[path] || seoMetaByPath['/']
    if (!seo) return

    document.title = seo.title
    upsertMeta({ name: 'description', content: seo.description })
    upsertMeta({ name: 'robots', content: seo.robots || 'index,follow' })
    upsertMeta({ property: 'og:title', content: seo.ogTitle })
    upsertMeta({ property: 'og:description', content: seo.ogDescription })
    upsertMeta({ property: 'og:url', content: seo.ogUrl })
    upsertMeta({ property: 'og:type', content: seo.ogType || 'website' })
    upsertMeta({ name: 'twitter:card', content: seo.twitterCard || 'summary_large_image' })
    upsertMeta({ name: 'twitter:title', content: seo.twitterTitle })
    upsertMeta({ name: 'twitter:description', content: seo.twitterDescription })
    upsertCanonical(seo.canonical)
    upsertSchema(seo.schema)
  }, [])

  return null
}
