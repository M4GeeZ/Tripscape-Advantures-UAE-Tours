import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BookOpen, Check, CheckCircle2, ChevronDown, ChevronLeft, Edit3, Eye, EyeOff, FileText, Image as ImageIcon, LayoutDashboard, Star,
  LogOut, LoaderCircle, Menu, Plus, Save, Settings, ShieldCheck, Trash2, Upload, X
} from 'lucide-react'
import { apiUrl } from '../../utils/apiBaseUrl'

function adminMediaUrl(value) {
  const source = String(value || '')
  if (source.startsWith('/uploads/')) return apiUrl(`/uploads/${source.slice('/uploads/'.length)}`)
  return source
}

import './Admin.css'

const EMPTY_TOUR = {
  title: '', slug: '', category: 'Desert Safari', destination: 'Dubai', image: '', gallery: [],
  shortDescription: '', description: '', price: 'Contact for price', unit: '', duration: 'Tour experience',
  rating: '4.9', reviews: 0, included: [''], excluded: [''], faqs: [{ question: '', answer: '' }],
  featured: false, published: true, seoTitle: '', metaDescription: '', canonical: ''
}

const EMPTY_BLOG = {
  title: '', slug: '', category: 'Guides', image: '', excerpt: '', content: '<p>Start writing your article here...</p>',
  author: 'Tripscape Team', publishedAt: new Date().toISOString().slice(0, 10), readingTime: '5 min read',
  published: true, featured: false, seoTitle: '', metaDescription: '', canonical: '', faqs: []
}

const EMPTY_REVIEW = {
  name: '', rating: 5, text: '', source: 'Website', sourceUrl: '',
  reviewDate: new Date().toISOString().slice(0, 10), published: true, sortOrder: 0
}

async function api(path, options = {}) {
  const response = await fetch(apiUrl(path), {
    credentials: 'include',
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Request failed.')
  return data
}

function slugify(value = '') {
  return String(value).toLowerCase().trim().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function Field({ label, children, hint }) {
  return <label className="admin-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>
}

function TextInput(props) {
  return <input className="admin-input" {...props} />
}

function TextArea(props) {
  return <textarea className="admin-input admin-textarea" {...props} />
}

function ImageUpload({ value, onChange, label = 'Image' }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  const upload = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return alert('Please choose an image file.')
    if (file.size > 8 * 1024 * 1024) return alert('Image must be smaller than 8 MB.')
    setUploading(true)
    try {
      const reader = new FileReader()
      const data = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const result = await api('/api/admin/upload', { method: 'POST', body: JSON.stringify({ data }) })
      onChange(result.url)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="admin-upload-field">
      <span className="admin-upload-label">{label}</span>
      <div className="admin-upload-row">
        <button type="button" className="admin-secondary" onClick={() => inputRef.current?.click()} disabled={uploading}>
          <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload image'}
        </button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={(event) => upload(event.target.files?.[0])} />
        {value && <img className="admin-upload-preview" src={adminMediaUrl(value)} alt="Preview" />}
      </div>
      <TextInput value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder="/uploads/image.webp" />
    </div>
  )
}

function ListEditor({ label, items, onChange, placeholder }) {
  const update = (index, value) => onChange(items.map((item, i) => i === index ? value : item))
  const remove = (index) => onChange(items.filter((_, i) => i !== index))
  return (
    <div className="admin-list-editor">
      <div className="admin-section-label">{label}</div>
      {items.map((item, index) => (
        <div className="admin-list-row" key={`${index}-${item}`}>
          <TextInput value={item} placeholder={placeholder} onChange={(event) => update(index, event.target.value)} />
          <button type="button" className="admin-icon-btn danger" onClick={() => remove(index)} aria-label={`Remove ${label} item`}><Trash2 size={15} /></button>
        </div>
      ))}
      <button type="button" className="admin-add-link" onClick={() => onChange([...items, ''])}><Plus size={15} /> Add item</button>
    </div>
  )
}

function FaqEditor({ faqs, onChange }) {
  const update = (index, key, value) => onChange(faqs.map((faq, i) => i === index ? { ...faq, [key]: value } : faq))
  return (
    <div className="admin-faq-editor">
      <div className="admin-section-label">FAQs</div>
      {faqs.map((faq, index) => (
        <div className="admin-faq" key={index}>
          <div className="admin-faq-head"><strong>FAQ {index + 1}</strong><button type="button" className="admin-icon-btn danger" onClick={() => onChange(faqs.filter((_, i) => i !== index))}><X size={15} /></button></div>
          <TextInput value={faq.question} placeholder="Question" onChange={(event) => update(index, 'question', event.target.value)} />
          <TextArea rows={3} value={faq.answer} placeholder="Answer" onChange={(event) => update(index, 'answer', event.target.value)} />
        </div>
      ))}
      <button type="button" className="admin-add-link" onClick={() => onChange([...faqs, { question: '', answer: '' }])}><Plus size={15} /> Add FAQ</button>
    </div>
  )
}

function RichEditor({ value, onChange }) {
  const ref = useRef(null)
  const imageInput = useRef(null)

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || ''
  }, [value])

  const command = (name, arg = null) => {
    ref.current?.focus()
    document.execCommand(name, false, arg)
    onChange(ref.current?.innerHTML || '')
  }

  const uploadInlineImage = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) return alert('Please choose an image smaller than 8 MB.')
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const result = await api('/api/admin/upload', { method: 'POST', body: JSON.stringify({ data: reader.result }) })
        ref.current?.focus()
        document.execCommand('insertImage', false, result.url)
        onChange(ref.current?.innerHTML || '')
      } catch (error) { alert(error.message) }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="admin-editor">
      <div className="admin-editor-toolbar">
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => command('formatBlock', 'h2')}>H2</button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => command('formatBlock', 'h3')}>H3</button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => command('bold')}><strong>B</strong></button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => command('italic')}><em>I</em></button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => command('insertUnorderedList')}>• List</button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => command('insertOrderedList')}>1. List</button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => command('formatBlock', 'blockquote')}>Quote</button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { const url = window.prompt('Enter URL'); if (url) command('createLink', url) }}>Link</button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => imageInput.current?.click()}><ImageIcon size={15} /> Image</button>
        <input ref={imageInput} type="file" hidden accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => uploadInlineImage(event.target.files?.[0])} />
      </div>
      <div
        ref={ref}
        className="admin-editor-body"
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML || '')}
      />
    </div>
  )
}

function ToastStack({ items, onDismiss }) {
  return (
    <div className="admin-toast-stack" aria-live="polite" aria-atomic="true">
      {items.map((item) => (
        <div className={`admin-toast admin-toast--${item.type || 'success'}`} key={item.id}>
          <div className="admin-toast-icon"><CheckCircle2 size={17} /></div>
          <div className="admin-toast-copy"><strong>{item.title || 'Tripscape CMS'}</strong><span>{item.message}</span></div>
          <button type="button" className="admin-toast-close" onClick={() => onDismiss(item.id)} aria-label="Dismiss notification"><X size={14} /></button>
        </div>
      ))}
    </div>
  )
}

function DashboardHome({ stats }) {
  const cards = [
    ['Tours', stats.tours, stats.publishedTours, 'Published'],
    ['Articles', stats.blogs, stats.publishedBlogs, 'Published'],
    ['Reviews', stats.reviews, stats.publishedReviews, 'Published'],
  ]
  return (
    <div className="admin-dashboard-home">
      <div className="admin-welcome"><span>TRIPSCAPE CMS</span><h2>Manage your travel website.</h2><p>Add tours, packages and full editorial articles without changing the website code.</p></div>
      <div className="admin-stat-grid">
        {cards.map(([label, total, published, sub]) => <div className="admin-stat-card" key={label}><div><span>{label}</span><strong>{total}</strong></div><small>{published} {sub}</small></div>)}
        <div className="admin-stat-card admin-stat-card--secure"><ShieldCheck size={28} /><div><span>Authentication</span><strong>Secure</strong></div></div>
      </div>
      <div className="admin-info-card"><BookOpen size={22} /><div><strong>Publishing workflow</strong><p>Create as Draft, review the page, then switch Published on. Public pages use the same existing Tripscape card and booking UI.</p></div></div>
    </div>
  )
}

function TourForm({ initial, onSaved, onCancel, notify }) {
  const [form, setForm] = useState({ ...EMPTY_TOUR, ...initial })
  const [saving, setSaving] = useState(false)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event) => {
    event.preventDefault(); setSaving(true)
    try {
      const isEdit = Boolean(form._id)
      const result = await api(isEdit ? `/api/admin/tours/${form._id}` : '/api/admin/tours', { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify({ ...form, slug: form.slug || slugify(form.title) }) })
      notify?.(isEdit ? 'Tour updated successfully.' : 'New tour added successfully.', 'success', isEdit ? 'Tour edited' : 'New tour added')
      onSaved(result)
    } catch (error) { alert(error.message) } finally { setSaving(false) }
  }
  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-form-head"><div><span>TOUR / PACKAGE</span><h2>{form._id ? 'Edit tour' : 'Add new tour'}</h2></div><button type="button" className="admin-icon-btn" onClick={onCancel}><X size={18} /></button></div>
      <div className="admin-form-grid">
        <Field label="Title"><TextInput required value={form.title} onChange={(e) => update('title', e.target.value)} /></Field>
        <Field label="Slug"><TextInput value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="Auto-generated if empty" /></Field>
        <Field label="Category"><select className="admin-input" value={form.category} onChange={(e) => update('category', e.target.value)}>{['Desert Safari','Desert Adventures','City Tours','Attractions','Cruises','Water Activities','Aerial Experiences','Dubai Packages Tour','Quad Bike','Dune Buggy','Private Desert Setup','Private Tours'].map((item) => <option key={item}>{item}</option>)}</select></Field>
        <Field label="Location / Destination"><select className="admin-input" value={form.destination} onChange={(e) => update('destination', e.target.value)}>{['Dubai','Abu Dhabi','Sharjah','Ras Al Khaimah','Fujairah','Ajman','Umm Al Quwain','UAE'].map((item) => <option key={item}>{item}</option>)}</select></Field>
        <Field label="Duration"><TextInput value={form.duration} onChange={(e) => update('duration', e.target.value)} /></Field>
        <Field label="Rating"><TextInput value={form.rating} onChange={(e) => update('rating', e.target.value)} /></Field>
        <Field label="Reviews"><TextInput type="number" min="0" value={form.reviews} onChange={(e) => update('reviews', e.target.value)} /></Field>
        <Field label="Short card description"><TextArea rows={3} value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} /></Field>
        <Field label="SEO title"><TextInput value={form.seoTitle} onChange={(e) => update('seoTitle', e.target.value)} /></Field>
        <Field label="Meta description"><TextArea rows={3} value={form.metaDescription} onChange={(e) => update('metaDescription', e.target.value)} /></Field>
        <Field label="Canonical URL"><TextInput value={form.canonical} onChange={(e) => update('canonical', e.target.value)} placeholder="Optional" /></Field>
      </div>
      <ImageUpload label="Main image" value={form.image} onChange={(value) => update('image', value)} />
      <div className="admin-form-grid admin-form-grid--full"><Field label="Full description"><TextArea rows={9} value={form.description} onChange={(e) => update('description', e.target.value)} /></Field></div>
      <div className="admin-form-two"><ListEditor label="Inclusions" items={form.included} onChange={(value) => update('included', value)} placeholder="What is included?" /><ListEditor label="Exclusions" items={form.excluded} onChange={(value) => update('excluded', value)} placeholder="What is not included?" /></div>
      <FaqEditor faqs={form.faqs} onChange={(value) => update('faqs', value)} />
      <div className="admin-toggle-row"><label><input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} /> Featured</label><label><input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} /> Published</label></div>
      <div className="admin-form-actions"><button type="button" className="admin-secondary" onClick={onCancel}>Cancel</button><button type="submit" className="admin-primary" disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save tour'}</button></div>
    </form>
  )
}

function BlogForm({ initial, onSaved, onCancel, notify }) {
  const [form, setForm] = useState({ ...EMPTY_BLOG, ...initial })
  const [saving, setSaving] = useState(false)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event) => {
    event.preventDefault(); setSaving(true)
    try {
      const isEdit = Boolean(form._id)
      const result = await api(isEdit ? `/api/admin/blogs/${form._id}` : '/api/admin/blogs', { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify({ ...form, slug: form.slug || slugify(form.title) }) })
      notify?.(isEdit ? 'Article updated successfully.' : 'New article added successfully.', 'success', isEdit ? 'Article edited' : 'New article added')
      onSaved(result)
    } catch (error) { alert(error.message) } finally { setSaving(false) }
  }
  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-form-head"><div><span>TRAVEL JOURNAL</span><h2>{form._id ? 'Edit article' : 'Add new article'}</h2></div><button type="button" className="admin-icon-btn" onClick={onCancel}><X size={18} /></button></div>
      <div className="admin-form-grid">
        <Field label="Article title"><TextInput required value={form.title} onChange={(e) => update('title', e.target.value)} /></Field>
        <Field label="Slug"><TextInput value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="Auto-generated if empty" /></Field>
        <Field label="Category"><select className="admin-input" value={form.category} onChange={(e) => update('category', e.target.value)}>{['Tips','Guides','Reviews','News','Destinations'].map((item) => <option key={item}>{item}</option>)}</select></Field>
        <Field label="Author"><TextInput value={form.author} onChange={(e) => update('author', e.target.value)} /></Field>
        <Field label="Publish date"><TextInput type="date" value={String(form.publishedAt || '').slice(0,10)} onChange={(e) => update('publishedAt', e.target.value)} /></Field>
        <Field label="Reading time"><TextInput value={form.readingTime} onChange={(e) => update('readingTime', e.target.value)} /></Field>
        <Field label="Excerpt / short description"><TextArea rows={4} value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} /></Field>
        <Field label="SEO title"><TextInput value={form.seoTitle} onChange={(e) => update('seoTitle', e.target.value)} /></Field>
        <Field label="Meta description"><TextArea rows={4} value={form.metaDescription} onChange={(e) => update('metaDescription', e.target.value)} /></Field>
        <Field label="Canonical URL"><TextInput value={form.canonical} onChange={(e) => update('canonical', e.target.value)} placeholder="Optional" /></Field>
      </div>
      <ImageUpload label="Featured image" value={form.image} onChange={(value) => update('image', value)} />
      <div className="admin-editor-section"><div className="admin-section-label">Full article content</div><RichEditor value={form.content} onChange={(value) => update('content', value)} /></div>
      <div className="admin-toggle-row"><label><input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} /> Featured on article list</label><label><input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} /> Published</label></div>
      <div className="admin-form-actions"><button type="button" className="admin-secondary" onClick={onCancel}>Cancel</button><button type="submit" className="admin-primary" disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save article'}</button></div>
    </form>
  )
}

function ReviewForm({ initial, onSaved, onCancel, notify }) {
  const [form, setForm] = useState({ ...EMPTY_REVIEW, ...initial })
  const [saving, setSaving] = useState(false)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event) => {
    event.preventDefault(); setSaving(true)
    try {
      const isEdit = Boolean(form._id)
      const result = await api(isEdit ? `/api/admin/reviews/${form._id}` : '/api/admin/reviews', {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      })
      notify?.(isEdit ? 'Review updated successfully.' : 'New review added successfully.', 'success', isEdit ? 'Review edited' : 'New review added')
      onSaved(result)
    } catch (error) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-form-head">
        <div><span>REVIEWS</span><h2>{form._id ? 'Edit review' : 'Add new review'}</h2></div>
        <button type="button" className="admin-icon-btn" onClick={onCancel}><X size={18} /></button>
      </div>
      <div className="admin-form-grid">
        <Field label="Reviewer name"><TextInput required maxLength={120} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Ahmed Khan" /></Field>
        <Field label="Rating">
          <select className="admin-input" value={form.rating} onChange={(e) => update('rating', Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} {value === 1 ? 'star' : 'stars'}</option>)}
          </select>
        </Field>
        <Field label="Source">
          <select className="admin-input" value={form.source} onChange={(e) => update('source', e.target.value)}>
            {['Website', 'Google', 'Tripadvisor', 'Facebook', 'Other'].map((item) => <option key={item}>{item}</option>)}
          </select>
        </Field>
        <Field label="Review date"><TextInput type="date" value={String(form.reviewDate || '').slice(0, 10)} onChange={(e) => update('reviewDate', e.target.value)} /></Field>
        <Field label="Source URL"><TextInput type="url" value={form.sourceUrl} onChange={(e) => update('sourceUrl', e.target.value)} placeholder="Optional review/source link" /></Field>
        <Field label="Sort order" hint="Lower numbers appear first."><TextInput type="number" min="0" value={form.sortOrder} onChange={(e) => update('sortOrder', Number(e.target.value) || 0)} /></Field>
      </div>
      <div className="admin-form-grid admin-form-grid--full">
        <Field label="Review text"><TextArea required rows={7} maxLength={2000} value={form.text} onChange={(e) => update('text', e.target.value)} placeholder="Write the customer's review..." /></Field>
      </div>
      <div className="admin-toggle-row">
        <label><input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} /> Published on homepage</label>
      </div>
      <div className="admin-form-actions">
        <button type="button" className="admin-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="admin-primary" disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save review'}</button>
      </div>
    </form>
  )
}

function ReviewsManager({ onChanged, notify }) {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try { setItems(await api('/api/admin/reviews')) }
    catch (error) { alert(error.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const remove = async (item) => {
    if (!window.confirm(`Delete review from “${item.name}”?`)) return
    try {
      await api(`/api/admin/reviews/${item._id}`, { method: 'DELETE' })
      notify?.('Review deleted successfully.', 'success', 'Review deleted')
      await load()
      onChanged()
    } catch (error) { alert(error.message) }
  }

  if (editing) {
    return <ReviewForm initial={editing === 'new' ? EMPTY_REVIEW : editing} notify={notify} onCancel={() => setEditing(null)} onSaved={async () => { setEditing(null); await load(); onChanged() }} />
  }

  return (
    <section className="admin-list-view">
      <div className="admin-page-head">
        <div><span>CUSTOMER FEEDBACK</span><h2>Manage reviews</h2></div>
        <button className="admin-primary" onClick={() => setEditing('new')}><Plus size={17} /> Add review</button>
      </div>
      {loading ? <div className="admin-loading">Loading reviews...</div> : items.length === 0 ? (
        <div className="admin-empty-state"><Star size={22} /><strong>No reviews added yet.</strong><span>Add a customer review and publish it to the homepage.</span></div>
      ) : (
        <div className="admin-content-list">
          {items.map((item) => (
            <article className="admin-content-row admin-review-row" key={item._id}>
              <div className="admin-review-avatar"><Star size={22} fill="currentColor" /><strong>{item.rating}.0</strong></div>
              <div className="admin-row-main">
                <div>
                  <span className="admin-pill">{item.source || 'Website'}</span>
                  <h3>{item.name}</h3>
                  <p className="admin-review-preview">{item.text}</p>
                  <small className="admin-review-date">{item.reviewDate ? new Date(item.reviewDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</small>
                </div>
                <span className={`admin-status ${item.published ? 'published' : 'draft'}`}>{item.published ? 'Published' : 'Hidden'}</span>
              </div>
              <div className="admin-row-actions">
                {item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="admin-secondary">Source</a>}
                <button className="admin-icon-btn" onClick={() => setEditing(item)} aria-label={`Edit review by ${item.name}`}><Edit3 size={16} /></button>
                <button className="admin-icon-btn danger" onClick={() => remove(item)} aria-label={`Delete review by ${item.name}`}><Trash2 size={16} /></button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function ToursManager({ onChanged, notify }) {
  const [items, setItems] = useState([]); const [editing, setEditing] = useState(null); const [loading, setLoading] = useState(true)
  const load = async () => { setLoading(true); try { setItems(await api('/api/admin/tours')) } catch (error) { alert(error.message) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])
  const remove = async (item) => { if (!window.confirm(`Delete “${item.title}”?`)) return; try { await api(`/api/admin/tours/${item._id}`, { method: 'DELETE' }); notify?.('Tour deleted successfully.', 'success', 'Tour deleted'); await load(); onChanged() } catch (error) { alert(error.message) } }
  if (editing) return <TourForm initial={editing === 'new' ? EMPTY_TOUR : editing} notify={notify} onCancel={() => setEditing(null)} onSaved={async () => { setEditing(null); await load(); onChanged() }} />
  return <section className="admin-list-view"><div className="admin-page-head"><div><span>TOURS & PACKAGES</span><h2>Manage tour cards</h2></div><button className="admin-primary" onClick={() => setEditing('new')}><Plus size={17} /> Add tour</button></div>{loading ? <div className="admin-loading">Loading tours...</div> : <div className="admin-content-list">{items.map((item) => <article className="admin-content-row" key={item._id}><img src={item.image} alt="" /><div className="admin-row-main"><div><span className="admin-pill">{item.category}</span><h3>{item.title}</h3><p>{item.destination} · {item.duration}</p></div><span className={`admin-status ${item.published ? 'published' : 'draft'}`}>{item.published ? 'Published' : 'Draft'}</span></div><div className="admin-row-actions"><a href={`/tours/${item.categorySlug}/${item.slug}`} target="_blank" rel="noreferrer" className="admin-secondary">View</a><button className="admin-icon-btn" onClick={() => setEditing(item)}><Edit3 size={16} /></button><button className="admin-icon-btn danger" onClick={() => remove(item)}><Trash2 size={16} /></button></div></article>)}</div>}</section>
}

function BlogsManager({ onChanged, notify }) {
  const [items, setItems] = useState([]); const [editing, setEditing] = useState(null); const [loading, setLoading] = useState(true)
  const load = async () => { setLoading(true); try { setItems(await api('/api/admin/blogs')) } catch (error) { alert(error.message) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])
  const remove = async (item) => { if (!window.confirm(`Delete “${item.title}”?`)) return; try { await api(`/api/admin/blogs/${item._id}`, { method: 'DELETE' }); notify?.('Article deleted successfully.', 'success', 'Article deleted'); await load(); onChanged() } catch (error) { alert(error.message) } }
  if (editing) return <BlogForm initial={editing === 'new' ? EMPTY_BLOG : editing} notify={notify} onCancel={() => setEditing(null)} onSaved={async () => { setEditing(null); await load(); onChanged() }} />
  return <section className="admin-list-view"><div className="admin-page-head"><div><span>TRAVEL JOURNAL</span><h2>Manage articles</h2></div><button className="admin-primary" onClick={() => setEditing('new')}><Plus size={17} /> Add article</button></div>{loading ? <div className="admin-loading">Loading articles...</div> : <div className="admin-content-list">{items.map((item) => <article className="admin-content-row" key={item._id}><img src={item.image} alt="" /><div className="admin-row-main"><div><span className="admin-pill">{item.category}</span><h3>{item.title}</h3><p>{item.author} · {item.time}</p></div><span className={`admin-status ${item.published ? 'published' : 'draft'}`}>{item.published ? 'Published' : 'Draft'}</span></div><div className="admin-row-actions"><a href={`/blog/${item.slug}`} target="_blank" rel="noreferrer" className="admin-secondary">View</a><button className="admin-icon-btn" onClick={() => setEditing(item)}><Edit3 size={16} /></button><button className="admin-icon-btn danger" onClick={() => remove(item)}><Trash2 size={16} /></button></div></article>)}</div>}</section>
}

function AdminLogin({ onLogin, notify }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginStage, setLoginStage] = useState('idle')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (loginStage !== 'checking') {
      return undefined
    }
    const duration = 1800
    const startedAt = performance.now()
    let frameId
    const tick = (now) => {
      const next = Math.min(100, Math.round(((now - startedAt) / duration) * 100))
      setProgress(next)
      if (next < 100) frameId = window.requestAnimationFrame(tick)
    }
    frameId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frameId)
  }, [loginStage])

  const resetLogin = () => {
    setLoginStage('idle')
    setLoading(false)
    setError('')
    setProgress(0)
  }

  const submit = async (event) => {
    event.preventDefault()
    if (loading) return

    setError('')
    setLoading(true)
    setLoginStage('checking')
    setProgress(0)

    const animationDelay = new Promise((resolve) => window.setTimeout(resolve, 1800))

    try {
      await api('/api/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })

      // Do not trust the login response alone. Confirm that the browser actually
      // stored the HttpOnly session cookie before opening the dashboard. A short
      // retry also absorbs proxy/cookie timing on slower production connections.
      let session = null
      let lastSessionError = null
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          session = await api('/api/admin/auth/me')
          break
        } catch (sessionError) {
          lastSessionError = sessionError
          if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 250 * (attempt + 1)))
        }
      }
      if (!session?.authenticated) {
        throw lastSessionError || new Error('Secure admin session could not be established. Please try again.')
      }

      await animationDelay
      setLoginStage('success')
      notify?.('Admin authentication completed successfully.', 'success', 'Admin login')
      window.setTimeout(() => onLogin(session), 900)
    } catch (err) {
      await animationDelay
      setError(err.message || 'Invalid admin credentials.')
      setLoginStage('failed')
    } finally {
      setLoading(false)
    }
  }

  if (loginStage === 'checking') {
    return (
      <div className="admin-login-page admin-login-page--checking">
        <div className="admin-login-card admin-login-card--checking">
          <div className="admin-login-glow"></div>
          <div className="admin-check-visual">
            <div className="admin-check-ring admin-check-ring--outer"></div>
            <div className="admin-check-ring admin-check-ring--inner"></div>
            <LoaderCircle className="admin-spin" size={42} />
          </div>
          <span>TRIPSCAPE SECURITY</span>
          <h1>Checking access...</h1>
          <p>Verifying your admin credentials and securing your session.</p>
          <div className="admin-check-status"><i></i><span>Authentication in progress</span><strong>{progress}%</strong></div>
          <div className="admin-check-progress"><i style={{ width: `${progress}%` }}></i></div>
          <small className="admin-check-percent">{progress >= 100 ? 'Verification complete. Finalizing access...' : 'Checking credentials securely...'}</small>
        </div>
      </div>
    )
  }

  if (loginStage === 'success') {
    return (
      <div className="admin-login-page admin-login-page--success">
        <div className="admin-login-success-card">
          <div className="admin-success-orbit"><span></span><span></span><CheckCircle2 size={52} /></div>
          <span>TRIPSCAPE CMS</span>
          <h1 className="admin-result-title">Congratulations!</h1>
          <p>You successfully logged in.</p>
          <div className="admin-success-progress"><i></i></div>
          <small>Opening your secure dashboard...</small>
        </div>
      </div>
    )
  }

  if (loginStage === 'failed') {
    return (
      <div className="admin-login-page admin-login-page--failed">
        <div className="admin-login-failure-card">
          <div className="admin-failure-icon"><X size={58} strokeWidth={2.5} /></div>
          <span>TRIPSCAPE SECURITY</span>
          <h1 className="admin-result-title">Authentication Failed</h1>
          <p>{error || 'The email or password you entered is incorrect.'}</p>
          <div className="admin-failure-line"><i></i><span>Access denied</span></div>
          <button type="button" className="admin-primary admin-retry-btn" onClick={resetLogin}>
            <ShieldCheck size={17} /> Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-login-page">
      <div className={`admin-login-card ${loading ? 'is-loading' : ''}`}>
        <div className="admin-login-glow"></div>
        <div className="admin-login-mark"><ShieldCheck size={25} /></div>
        <span>TRIPSCAPE ADVENTURES</span>
        <h1>Secure Admin Access</h1>
        <p>Sign in to manage tours, packages and travel articles securely.</p>
        <form onSubmit={submit}>
          <Field label="Admin email">
            <TextInput type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter admin email" />
          </Field>
          <Field label="Password">
            <div className="admin-password-wrap">
              <TextInput type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
              <button type="button" className="admin-password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </Field>
          {error && <div className="admin-error"><ShieldCheck size={14} /> <span>{error}</span></div>}
          <button className="admin-primary admin-login-btn" disabled={loading}>
            <ShieldCheck size={17} /> Sign in securely
          </button>
        </form>
        <div className="admin-login-security"><ShieldCheck size={14} /><span>Protected admin session · Authorized access only</span></div>
      </div>
    </div>
  )
}

export default function AdminApp() {
  const [auth, setAuth] = useState(null)
  const [checking, setChecking] = useState(true)
  const [section, setSection] = useState('dashboard')
  const [stats, setStats] = useState({ tours: 0, publishedTours: 0, blogs: 0, publishedBlogs: 0, reviews: 0, publishedReviews: 0 })
  const [mobileNav, setMobileNav] = useState(false)
  const [toasts, setToasts] = useState([])

  const notify = (message, type = 'success', title = type === 'success' ? 'Action completed' : 'Tripscape CMS') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((current) => [...current.slice(-3), { id, message, type, title }])
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3600)
  }
  const dismissToast = (id) => setToasts((current) => current.filter((item) => item.id !== id))
  const loadStats = async () => { try { setStats(await api('/api/admin/stats')) } catch {} }

  useEffect(() => {
    api('/api/admin/auth/me').then(setAuth).catch(() => setAuth(null)).finally(() => setChecking(false))
  }, [])
  useEffect(() => { if (auth) loadStats() }, [auth])

  if (checking) return <><ToastStack items={toasts} onDismiss={dismissToast} /><div className="admin-loading-page"><div className="admin-page-loader"><LoaderCircle className="admin-spin" size={28} /><span>Checking secure session...</span></div></div></>
  if (!auth) return <><ToastStack items={toasts} onDismiss={dismissToast} /><AdminLogin onLogin={setAuth} notify={notify} /></>

  const logout = async () => {
    await api('/api/admin/auth/logout', { method: 'POST' }).catch(() => {})
    setAuth(null)
    setSection('dashboard')
    notify('You have been logged out securely.', 'success', 'Admin logout')
  }
  const nav = [
    ['dashboard', LayoutDashboard, 'Dashboard'], ['tours', FileText, 'Tours & Packages'], ['blogs', BookOpen, 'Blog / Articles'], ['reviews', Star, 'Reviews'],
  ]
  return (
    <>
      <ToastStack items={toasts} onDismiss={dismissToast} />
      <div className="admin-shell">
        <aside className={`admin-sidebar ${mobileNav ? 'open' : ''}`}>
          <div className="admin-brand"><ShieldCheck size={22} /><div><strong>Tripscape Adventures</strong><span>Admin CMS</span></div></div>
          <nav>{nav.map(([key, Icon, label]) => <button key={key} className={section === key ? 'active' : ''} onClick={() => { setSection(key); setMobileNav(false) }}><Icon size={18} /> {label}</button>)}</nav>
          <div className="admin-side-bottom"><span>{auth.email}</span><button onClick={logout}><LogOut size={16} /> Logout</button></div>
        </aside>
        <div className="admin-main">
          <header className="admin-topbar"><button className="admin-mobile-menu" onClick={() => setMobileNav(!mobileNav)}><Menu size={20} /></button><div><span>TRIPSCAPE ADVENTURES · ADMIN PANEL</span><strong>{section === 'dashboard' ? 'Dashboard' : section === 'tours' ? 'Tours & Packages' : section === 'blogs' ? 'Blog / Articles' : 'Reviews'}</strong></div><a href="/" className="admin-site-link">View website <ChevronLeft size={15} /></a></header>
          <main className="admin-page">
            {section === 'dashboard' && <DashboardHome stats={stats} />}
            {section === 'tours' && <ToursManager onChanged={loadStats} notify={notify} />}
            {section === 'blogs' && <BlogsManager onChanged={loadStats} notify={notify} />}
            {section === 'reviews' && <ReviewsManager onChanged={loadStats} notify={notify} />}
          </main>
        </div>
      </div>
    </>
  )
}
