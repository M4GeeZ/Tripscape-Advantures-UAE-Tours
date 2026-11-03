const ALLOWED_TAGS = new Set([
  'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'strong', 'em', 'u', 's', 'strike',
  'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'br', 'hr', 'font'
])

const ALLOWED_STYLES = new Set([
  'color', 'background-color', 'font-size', 'font-family', 'font-weight', 'font-style',
  'text-decoration', 'text-align', 'line-height', 'vertical-align'
])

function escapeAttr(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function cleanStyle(value) {
  return String(value || '')
    .split(';')
    .map((rule) => rule.trim())
    .filter(Boolean)
    .map((rule) => {
      const separator = rule.indexOf(':')
      if (separator < 1) return ''
      const property = rule.slice(0, separator).trim().toLowerCase()
      const cssValue = rule.slice(separator + 1).trim()
      if (!ALLOWED_STYLES.has(property)) return ''
      if (!cssValue || /(?:url\s*\(|expression\s*\(|javascript\s*:|@import|behavior\s*:|-moz-binding)/i.test(cssValue)) return ''
      if (/[<>]/.test(cssValue)) return ''
      return `${property}:${cssValue.slice(0, 300)}`
    })
    .filter(Boolean)
    .join(';')
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
    } else if (name === 'target' && value === '_blank') {
      attrs.push('target="_blank"')
    } else if (name === 'src' && /^(https?:|\/)/i.test(value)) {
      attrs.push(`src="${escapeAttr(value)}"`)
    } else if (name === 'alt') {
      attrs.push(`alt="${escapeAttr(value.slice(0, 300))}"`)
    } else if (name === 'title') {
      attrs.push(`title="${escapeAttr(value.slice(0, 300))}"`)
    } else if (name === 'style') {
      const style = cleanStyle(value)
      if (style) attrs.push(`style="${escapeAttr(style)}"`)
    } else if (name === 'face' && /^[a-zA-Z0-9 ,_-]{1,80}$/.test(value)) {
      attrs.push(`face="${escapeAttr(value)}"`)
    } else if (name === 'size' && /^[1-7]$/.test(value)) {
      attrs.push(`size="${value}"`)
    } else if (name === 'color' && /^[#a-zA-Z0-9(),.%\s-]{1,80}$/.test(value)) {
      attrs.push(`color="${escapeAttr(value)}"`)
    }
  }
  return attrs.length ? ` ${attrs.join(' ')}` : ''
}

export function sanitizeHtml(input = '') {
  let html = String(input)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/?(iframe|object|embed|form|input|button|textarea|select|option|link|meta|base|svg|math)[^>]*>/gi, '')
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
