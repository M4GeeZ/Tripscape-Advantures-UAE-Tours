// Controlled JSON-LD output for Tripscape. JSON is parsed, never injected as raw HTML.
const BASE_URL = 'https://tripscapetourism.com'
const absolute = (path) => {
  if (/^https?:\/\//i.test(String(path || ''))) return String(path)
  return `${BASE_URL}${String(path || '/').startsWith('/') ? '' : '/'}${path || ''}`
}
const stripMarkup = (text) => String(text || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getFaqs = (item) => (Array.isArray(item.faqs) ? item.faqs : []).filter(f => f && f.question && f.answer)

export function validateJsonLd(source) {
  let object
  try { object = JSON.parse(String(source || '')) } catch { throw new Error('Invalid JSON. Remove script tags, comments and trailing commas.') }
  if (!object || typeof object !== 'object' || Array.isArray(object)) throw new Error('Top-level JSON-LD must be an object.')
  if (!['https://schema.org', 'http://schema.org'].includes(object['@context'])) throw new Error('Add "@context": "https://schema.org".')
  if (!object['@type'] && !(Array.isArray(object['@graph']) && object['@graph'].length)) throw new Error('Add @type or a non-empty @graph.')
  return object
}

export function buildAutoSchema(item, kind = 'page', path) {
  const url = absolute(item.canonical || path)
  const title = item.title || item.seoTitle || item.name || 'Tripscape Tourism'
  const description = stripMarkup(item.metaDescription || item.shortDescription || item.description || item.excerpt || item.copy)
  const crumbs = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` }]
  if (kind === 'tour') crumbs.push({ '@type': 'ListItem', position: 2, name: 'Tours', item: `${BASE_URL}/tours` })
  if (kind === 'blog') crumbs.push({ '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` })
  crumbs.push({ '@type': 'ListItem', position: crumbs.length + 1, name: title, item: url })
  const graph = [{ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumbs`, itemListElement: crumbs }]
  if (kind === 'tour') {
    const touristTrip = {
      '@type': 'TouristTrip', '@id': `${url}#tour`, name: title, url,
      description,
      provider: { '@type': 'TravelAgency', name: 'Tripscape Tourism', url: BASE_URL },
      ...(item.destination ? { touristType: 'Visitors to ' + item.destination } : {}),
      ...(item.image ? { image: absolute(item.image) } : {}),
    }
    const price = String(item.price || '').match(/AED\s*([0-9,]+)/i)
    if (price) {
      touristTrip.offers = { '@type': 'Offer', url, priceCurrency: 'AED', price: Number(price[1].replace(/,/g, '')) }
    }
    graph.push(touristTrip)
  } else if (kind === 'blog') {
    graph.push({
      '@type': 'BlogPosting', '@id': `${url}#article`, headline: title,
      description, mainEntityOfPage: url, url,
      author: { '@type': 'Organization', name: item.author || 'Tripscape Tourism' },
      publisher: { '@type': 'Organization', name: 'Tripscape Tourism', url: BASE_URL },
      ...(item.image ? { image: absolute(item.image) } : {}),
      ...(item.publishedAt ? { datePublished: String(item.publishedAt) } : {}),
      ...(item.updatedAt ? { dateModified: String(item.updatedAt) } : {}),
    })
  } else {
    graph.push({ '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description })
  }
  if (getFaqs(item).length) {
    graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: getFaqs(item).map(f => ({
      '@type': 'Question', name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: stripMarkup(f.answer) }
    })) })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

export function resolveSchema(item, kind, path, existingStaticSchema = null) {
  const mode = item?.schemaMode || 'auto'
  if (mode === 'disabled') return null
  if (mode === 'custom') {
    try { return validateJsonLd(item?.schemaJsonLd) } catch { return null }
  }
  return existingStaticSchema || buildAutoSchema(item || {}, kind, path)
}

export function writePageSchema(schema) {
  const id = 'tripscape-seo-schema'
  let node = document.head.querySelector(`#${id}`)
  if (!schema) { node?.remove(); return }
  if (!node) { node = document.createElement('script'); node.id = id; node.type = 'application/ld+json'; document.head.appendChild(node) }
  node.textContent = JSON.stringify(schema).replace(/</g, '\\u003c')
}
