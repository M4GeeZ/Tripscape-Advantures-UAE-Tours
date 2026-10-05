const ALLOWED_TAGS = new Set(['div', 'span', 'p', 'h2', 'h3', 'h4', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'br', 'hr'])

function escapeAttr(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function cleanAttributes(rawAttributes) {
  const attrs = []
  const regex = /([a-zA-Z:-]+)\s*=\s*(["'])(.*?)\2/g
  let match
  while ((match = regex.exec(rawAttributes))) {
    const name = match[1].toLowerCase()
    const value = match[3].trim()
    if (name === 'href' && /^(https?:|mailto:|tel:|\/|#)/i.test(value)) {
      attrs.push(`href="${escapeAttr(value)}" rel="noopener noreferrer"`)
    } else if (name === 'src' && /^(https?:|\/)/i.test(value)) {
      attrs.push(`src="${escapeAttr(value)}"`)
    } else if (name === 'alt') {
      attrs.push(`alt="${escapeAttr(value.slice(0, 300))}"`)
    } else if (name === 'title') {
      attrs.push(`title="${escapeAttr(value.slice(0, 300))}"`)
    }
  }
  return attrs.length ? ` ${attrs.join(' ')}` : ''
}

export function sanitizeHtml(input = '') {
  let html = String(input)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?(script|style|iframe|object|embed|form|input|button|textarea|select|option|link|meta|base|svg|math)[^>]*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:/gi, '')

  html = html.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (full, tagName, attributes) => {
    const tag = tagName.toLowerCase()
    if (!ALLOWED_TAGS.has(tag)) return ''
    if (full.startsWith('</')) return `</${tag}>`
    if (tag === 'br' || tag === 'hr') return `<${tag}>`
    return `<${tag}${cleanAttributes(attributes)}>`
  })

  return html.trim()
}
