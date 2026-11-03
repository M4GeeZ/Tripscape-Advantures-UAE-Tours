// Shared validation for all CMS structured-data writes.
export const SCHEMA_MODES = ['auto', 'custom', 'disabled']

export function validateSchemaJson(raw) {
  const text = String(raw ?? '').trim()
  if (!text || text.length > 65000) throw new Error('Custom JSON-LD must contain valid JSON (max 65 KB).')
  let parsed
  try { parsed = JSON.parse(text) } catch { throw new Error('Invalid JSON-LD: please enter valid JSON without script tags.') }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('JSON-LD must be a JSON object.')
  if (parsed['@context'] !== 'https://schema.org' && parsed['@context'] !== 'http://schema.org') {
    throw new Error('JSON-LD must include "@context": "https://schema.org".')
  }
  if (!(parsed['@type'] || (Array.isArray(parsed['@graph']) && parsed['@graph'].length))) {
    throw new Error('JSON-LD must contain @type or a non-empty @graph.')
  }
  return JSON.stringify(parsed)
}

export function validateSchemaFields(body) {
  try {
    const schemaMode = String(body.schemaMode || 'auto')
    if (!SCHEMA_MODES.includes(schemaMode)) throw new Error('Invalid schema mode.')
    const schemaJsonLd = schemaMode === 'custom' ? validateSchemaJson(body.schemaJsonLd) : String(body.schemaJsonLd || '').slice(0, 65000)
    const robots = String(body.robots || 'index,follow').trim().slice(0, 120)
    if (!/^(index|noindex)(,(follow|nofollow))?$/i.test(robots)) throw new Error('Robots must be index,follow or noindex,nofollow (or another valid pair).')
    return { value: { schemaMode, schemaJsonLd, robots, focusKeyword: String(body.focusKeyword || '').trim().slice(0, 180) } }
  } catch (error) { return { error: error.message } }
}
