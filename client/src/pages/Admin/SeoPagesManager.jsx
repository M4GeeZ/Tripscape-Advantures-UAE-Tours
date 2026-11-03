import { useEffect, useState } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { apiUrl } from '../../utils/apiBaseUrl'
import { seoMetaByPath } from '../../seoMeta'
import { validateJsonLd } from '../../utils/schemaManager'
import SchemaEditor from './SchemaEditor'

const newPage = () => ({ path: '/', seoTitle: '', metaDescription: '', canonical: '', robots: 'index,follow', focusKeyword: '', schemaMode:'auto', schemaJsonLd:'', published: true })
async function api(path, options = {}) {
  const res = await fetch(apiUrl(path), {credentials:'include',...options,headers:{'Content-Type':'application/json',...(options.headers || {})}})
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.message || 'Unable to save SEO page.')
  return data
}

export default function SeoPagesManager({ notify }) {
  const [pages, setPages] = useState([])
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const paths = Object.keys(seoMetaByPath).sort()
  const refresh = async () => { try {setPages(await api('/api/admin/seo-pages'));setError('')} catch(e) {setError(e.message)} finally {setLoading(false)} }
  useEffect(() => { refresh() }, [])
  const update = (key, value) => setForm(current => ({...current,[key]:value}))
  const editPage = (path) => {
    const saved = pages.find(p => p.path === path)
    const staticPage = seoMetaByPath[path] || {}
    setForm(saved || {...newPage(), path, seoTitle:staticPage.title || '',metaDescription:staticPage.description || '',canonical:staticPage.canonical || ''})
    setError('')
  }
  const save = async (e) => {
    e.preventDefault();setError('')
    try {
      if (form.schemaMode === 'custom') validateJsonLd(form.schemaJsonLd)
      setSaving(true)
      await api('/api/admin/seo-pages',{method:'POST',body:JSON.stringify(form)})
      notify?.('SEO page metadata and schema saved.','success','SEO saved')
      setForm(null);await refresh()
    } catch (err) {setError(err.message)} finally {setSaving(false)}
  }
  const remove = async (page) => {
    if (!window.confirm(`Remove SEO override for ${page.path}? Static SEO will remain in place.`))return
    try {await api(`/api/admin/seo-pages/${page._id}`,{method:'DELETE'});await refresh();notify?.('SEO override removed.','success')} catch(e){setError(e.message)}
  }
  return (
    <section className="admin-list-view">
      <div className="admin-page-head"><div><span>PAGE SEO CONTROL</span><h2>SEO Pages & Schema</h2><p>Manage static website pages, category pages and custom URLs.</p></div><button type="button" className="admin-primary" onClick={() => setForm(newPage())}><Plus size={16}/> Add URL</button></div>
      {error && <div className="admin-error">{error}</div>}
      {form ? <form className="admin-form" onSubmit={save}>
        <div className="admin-form-head"><div><span>SEO EDITOR</span><h2>Edit page metadata</h2></div><button type="button" className="admin-secondary" onClick={() => setForm(null)}>Back</button></div>
        <div className="admin-form-grid">
          <label className="admin-field"><span>Public path</span><input className="admin-input" required value={form.path} onChange={e => update('path',e.target.value)} placeholder="/about" /></label>
          <label className="admin-field"><span>Focus Keyword (internal)</span><input className="admin-input" value={form.focusKeyword || ''} onChange={e => update('focusKeyword',e.target.value)} /></label>
          <label className="admin-field"><span>SEO title</span><input className="admin-input" maxLength={180} value={form.seoTitle || ''} onChange={e => update('seoTitle',e.target.value)} /></label>
          <label className="admin-field"><span>Robots</span><select className="admin-input" value={form.robots || 'index,follow'} onChange={e=>update('robots',e.target.value)}><option>index,follow</option><option>noindex,follow</option><option>noindex,nofollow</option><option>index,nofollow</option></select></label>
          <label className="admin-field"><span>Canonical URL</span><input className="admin-input" value={form.canonical || ''} onChange={e=>update('canonical',e.target.value)} placeholder="https://tripscapetourism.com/about" /></label>
          <label className="admin-field"><span>Meta Description</span><textarea className="admin-input admin-textarea" rows={4} maxLength={320} value={form.metaDescription || ''} onChange={e=>update('metaDescription',e.target.value)} /></label>
        </div>
        <SchemaEditor form={{...form,title:form.seoTitle,description:form.metaDescription}} kind="page" path={form.path} update={update}/>
        <label className="admin-schema-published"><input type="checkbox" checked={form.published !== false} onChange={e=>update('published',e.target.checked)} /> Enable public SEO override</label>
        <div className="admin-form-actions"><button type="button" className="admin-secondary" onClick={() => setForm(null)}>Cancel</button><button type="submit" className="admin-primary" disabled={saving}><Save size={15}/>{saving?'Saving...':'Save SEO Page'}</button></div>
      </form> : <>
        <div className="admin-schema-path-picker"><label className="admin-field"><span>Select an existing website URL</span><select className="admin-input" defaultValue="" onChange={e => e.target.value && editPage(e.target.value)}><option value="" disabled>Select a page to edit...</option>{paths.map(path=><option value={path} key={path}>{path}</option>)}</select></label><span>{paths.length} static SEO paths detected, plus {pages.length} saved CMS overrides.</span></div>
        {loading ? <div className="admin-loading">Loading SEO pages...</div> : <div className="admin-content-list">{pages.map(p => <article className="admin-content-row admin-schema-row" key={p._id}><div className="admin-row-main"><div><span className="admin-pill">{p.schemaMode || 'auto'}</span><h3>{p.path}</h3><p>{p.seoTitle || '(using page default)'}</p></div><span className="admin-status">{p.published ? 'Enabled' : 'Disabled'}</span></div><div className="admin-row-actions"><button type="button" className="admin-secondary" onClick={()=>editPage(p.path)}>Edit</button><button type="button" className="admin-icon-btn danger" onClick={()=>remove(p)} title="Delete override"><Trash2 size={15}/></button></div></article>)}</div>}
      </>}
    </section>
  )
}
