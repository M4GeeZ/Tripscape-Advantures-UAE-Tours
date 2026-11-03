import { useState } from 'react'
import { buildAutoSchema, validateJsonLd } from '../../utils/schemaManager'
import './SchemaEditor.css'

export default function SchemaEditor({ form, update, kind = 'page', path }) {
  const [message, setMessage] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const mode = form.schemaMode || 'auto'
  const validate = () => {
    try {
      if (mode === 'custom') {
        const obj = validateJsonLd(form.schemaJsonLd)
        setMessage(`Valid JSON-LD: ${obj['@type'] || `${obj['@graph'].length} graph nodes`}`)
      } else setMessage(mode === 'disabled' ? 'Schema will be disabled for this page.' : 'Automatic schema is ready.')
    } catch (e) { setMessage(e.message) }
  }
  let preview = null
  try { preview = mode === 'custom' ? validateJsonLd(form.schemaJsonLd) : (mode === 'auto' ? buildAutoSchema(form,kind,path) : null) } catch {}
  return (
    <section className="admin-schema-panel">
      <div className="admin-schema-panel__head"><div><span>SEO / STRUCTURED DATA</span><h3>Schema Markup (JSON-LD)</h3><p>Control schema for this individual page. Add multiple types inside one @graph.</p></div></div>
      <label className="admin-field"><span>Schema Mode</span><select className="admin-input" value={mode} onChange={e => {update('schemaMode',e.target.value);setMessage('')}}>
        <option value="auto">Auto generate from page content</option><option value="custom">Custom JSON-LD</option><option value="disabled">Disable Schema</option>
      </select></label>
      {mode === 'custom' && <label className="admin-field"><span>Custom JSON-LD</span><textarea className="admin-input admin-schema-json" value={form.schemaJsonLd || ''} onChange={e => {update('schemaJsonLd',e.target.value);setMessage('')}} placeholder={'{ "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", "name": "Page title" }] }'} rows={12} spellCheck={false} /><small>Paste JSON only, not &lt;script&gt; tags. Must have @context and @type or @graph.</small></label>}
      {mode === 'auto' && <p className="admin-schema-note">Automatically uses page information for {kind === 'tour' ? 'TouristTrip + BreadcrumbList' : kind === 'blog' ? 'BlogPosting + BreadcrumbList' : 'WebPage + BreadcrumbList'}. FAQ schema is included only when FAQs exist.</p>}
      <div className="admin-schema-actions"><button type="button" className="admin-secondary" onClick={validate}>Validate schema</button><button type="button" className="admin-secondary" onClick={() => setPreviewOpen(v => !v)}>{previewOpen ? 'Hide preview' : 'Preview JSON-LD'}</button></div>
      {message && <p className="admin-schema-message" role="status">{message}</p>}
      {previewOpen && <pre className="admin-schema-preview">{preview ? JSON.stringify(preview,null,2) : 'No valid schema is enabled.'}</pre>}
    </section>
  )
}
