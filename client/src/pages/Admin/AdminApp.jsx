import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlignCenter, AlignLeft, AlignRight, BookOpen, Check, CheckCircle2, ChevronDown, ChevronLeft, Edit3, Eye, EyeOff, FileText, Image as ImageIcon, LayoutDashboard, Link2, List, ListOrdered, LogOut, LoaderCircle, Menu, Plus, Redo2, RemoveFormatting, Save, Settings, ShieldCheck, Star, Trash2, Undo2, Upload, X
} from 'lucide-react'
import { apiUrl } from '../../utils/apiBaseUrl'
import SchemaEditor from './SchemaEditor'
import SeoPagesManager from './SeoPagesManager'
import { validateJsonLd } from '../../utils/schemaManager'

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
  featured: false, published: true, seoTitle: '', metaDescription: '', canonical: '',
  robots: 'index,follow', focusKeyword: '', schemaMode: 'auto', schemaJsonLd: ''
}

const EMPTY_BLOG = {
  title: '', slug: '', category: 'Guides', image: '', excerpt: '', content: '<p>Start writing your article here...</p>',
  author: 'Tripscape Team', publishedAt: new Date().toISOString().slice(0, 10), readingTime: '5 min read',
  published: true, featured: false, seoTitle: '', metaDescription: '', canonical: '', faqs: [],
  robots: 'index,follow', focusKeyword: '', schemaMode: 'auto', schemaJsonLd: ''
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

// Uploads one image file and returns its public URL.
async function uploadAdminImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.')
  if (file.size > 8 * 1024 * 1024) throw new Error(`"${file.name}" is larger than 8 MB.`)
  const data = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
  const result = await api('/api/admin/upload', { method: 'POST', body: JSON.stringify({ data }) })
  return result.url
}

const MAX_TOUR_IMAGES = 10
const TOUR_IMAGE_ROLES = ['Card + page hero', 'Intro photo']

// Ordered tour photos: 1 = cards + hero, 2 = intro, 3–10 = gallery on the tour page.
function TourImagesEditor({ image, gallery, onChange }) {
  const images = useMemo(() => {
    const seen = new Set()
    return [image, ...(gallery || [])]
      .map((src) => String(src || '').trim())
      .filter((src) => src && !seen.has(src) && seen.add(src))
      .slice(0, MAX_TOUR_IMAGES)
  }, [image, gallery])
  const [busy, setBusy] = useState('')
  const [urlDraft, setUrlDraft] = useState('')
  const addInput = useRef(null)
  const replaceInput = useRef(null)
  const replaceIndex = useRef(-1)

  const commit = (list) => onChange(list.filter(Boolean).slice(0, MAX_TOUR_IMAGES))
  const free = MAX_TOUR_IMAGES - images.length

  const addFiles = async (files) => {
    const picked = [...(files || [])].slice(0, free)
    if (!picked.length) return
    if (files.length > free) alert(`Only ${free} more image${free === 1 ? '' : 's'} can be added (maximum ${MAX_TOUR_IMAGES}).`)
    let list = [...images]
    for (const [index, file] of picked.entries()) {
      setBusy(`Uploading ${index + 1} of ${picked.length}...`)
      try {
        list = [...list, await uploadAdminImage(file)]
        commit(list)
      } catch (error) {
        alert(error.message)
      }
    }
    setBusy('')
  }

  const replaceFile = async (file) => {
    const index = replaceIndex.current
    if (!file || index < 0) return
    setBusy(`Replacing image ${index + 1}...`)
    try {
      const url = await uploadAdminImage(file)
      commit(images.map((src, i) => (i === index ? url : src)))
    } catch (error) {
      alert(error.message)
    } finally {
      setBusy('')
    }
  }

  const move = (index, step) => {
    const target = index + step
    if (target < 0 || target >= images.length) return
    const list = [...images]
    ;[list[index], list[target]] = [list[target], list[index]]
    commit(list)
  }

  const addUrl = () => {
    const url = urlDraft.trim()
    if (!url || images.length >= MAX_TOUR_IMAGES) return
    if (!images.includes(url)) commit([...images, url])
    setUrlDraft('')
  }

  return (
    <div className="admin-upload-field admin-tour-images">
      <div className="admin-tour-images__head">
        <div>
          <span className="admin-upload-label">Tour images ({images.length}/{MAX_TOUR_IMAGES})</span>
          <small>Image 1 shows on every card and as the page background. Image 2 is the intro photo. Images 3–10 make the page gallery, in this order.</small>
        </div>
        <button type="button" className="admin-secondary" onClick={() => addInput.current?.click()} disabled={Boolean(busy) || free <= 0}>
          <Upload size={16} /> {busy || 'Upload images'}
        </button>
        <input ref={addInput} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={(event) => { addFiles(event.target.files); event.target.value = '' }} />
        <input ref={replaceInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={(event) => { replaceFile(event.target.files?.[0]); event.target.value = '' }} />
      </div>

      <div className="admin-tour-images__grid">
        {Array.from({ length: MAX_TOUR_IMAGES }, (_, index) => {
          const src = images[index]
          return (
            <div key={index} className={`admin-tour-image ${src ? '' : 'is-empty'} ${index === 0 ? 'is-main' : ''}`}>
              <span className="admin-tour-image__number">{index + 1}</span>
              {src ? (
                <>
                  <img src={adminMediaUrl(src)} alt={`Tour image ${index + 1}`} />
                  <div className="admin-tour-image__tools">
                    <button type="button" title="Move earlier" onClick={() => move(index, -1)} disabled={index === 0}><ChevronLeft size={14} /></button>
                    <button type="button" title="Replace image" onClick={() => { replaceIndex.current = index; replaceInput.current?.click() }}><Upload size={13} /></button>
                    <button type="button" title="Move later" onClick={() => move(index, 1)} disabled={index === images.length - 1}><ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} /></button>
                    <button type="button" title="Remove image" className="danger" onClick={() => commit(images.filter((_, i) => i !== index))}><Trash2 size={13} /></button>
                  </div>
                </>
              ) : (
                <button type="button" className="admin-tour-image__add" onClick={() => addInput.current?.click()} disabled={Boolean(busy) || index !== images.length}>
                  <Plus size={16} />
                </button>
              )}
              <small className="admin-tour-image__role">{TOUR_IMAGE_ROLES[index] || 'Gallery'}</small>
            </div>
          )
        })}
      </div>

      <div className="admin-tour-images__url">
        <TextInput value={urlDraft} onChange={(event) => setUrlDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addUrl() } }} placeholder="Or paste an image URL and press Add" disabled={free <= 0} />
        <button type="button" className="admin-secondary" onClick={addUrl} disabled={!urlDraft.trim() || free <= 0}><Plus size={15} /> Add</button>
      </div>
    </div>
  )
}

function ImageUpload({ value, onChange, label = 'Image' }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  const upload = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      onChange(await uploadAdminImage(file))
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
  const savedRange = useRef(null)
  const [linkDialog, setLinkDialog] = useState(null)

  useEffect(() => {
    try { document.execCommand('styleWithCSS', false, true) } catch {}
  }, [])

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || ''
  }, [value])

  const emit = () => onChange(ref.current?.innerHTML || '')

  const saveSelection = () => {
    const selection = window.getSelection()
    if (!selection || !selection.rangeCount || !ref.current) return null
    const range = selection.getRangeAt(0)
    if (!ref.current.contains(range.commonAncestorContainer)) return null
    savedRange.current = range.cloneRange()
    return savedRange.current
  }

  const restoreSelection = () => {
    if (!savedRange.current) return false
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(savedRange.current)
    ref.current?.focus()
    return true
  }

  const command = (name, arg = null) => {
    ref.current?.focus()
    document.execCommand(name, false, arg)
    emit()
  }

  const applyFontSize = (size) => {
    if (!size) return
    ref.current?.focus()
    document.execCommand('fontSize', false, '7')
    const fonts = ref.current?.querySelectorAll('font[size="7"]') || []
    fonts.forEach((font) => {
      const span = document.createElement('span')
      span.style.fontSize = `${size}px`
      span.innerHTML = font.innerHTML
      font.replaceWith(span)
    })
    emit()
  }

  const applyFontFamily = (family) => {
    if (!family) return
    command('fontName', family)
  }

  const openLinkDialog = () => {
    const selection = window.getSelection()
    const range = saveSelection()
    let existingUrl = ''
    let existingTarget = false
    if (selection?.anchorNode) {
      const element = selection.anchorNode.nodeType === Node.ELEMENT_NODE
        ? selection.anchorNode
        : selection.anchorNode.parentElement
      const link = element?.closest?.('a')
      if (link) {
        existingUrl = link.getAttribute('href') || ''
        existingTarget = link.getAttribute('target') === '_blank'
      }
    }
    setLinkDialog({ url: existingUrl, newTab: existingTarget, text: range?.toString() || '', range })
  }

  const applyLink = () => {
    const dialog = linkDialog
    if (!dialog) return
    restoreSelection()
    const url = String(dialog.url || '').trim()
    if (!url) {
      setLinkDialog(null)
      return
    }
    const safeUrl = /^(https?:|mailto:|tel:|\/|#)/i.test(url) ? url : `https://${url}`
    const selection = window.getSelection()
    const selectedText = selection?.toString() || ''
    if (!selectedText && dialog.text) {
      document.execCommand('insertHTML', false, `<a href="${safeUrl.replaceAll('\"', '&quot;')}">${dialog.text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</a>`)
    } else {
      document.execCommand('createLink', false, safeUrl)
    }
    const updatedSelection = window.getSelection()
    const anchor = updatedSelection?.anchorNode?.parentElement?.closest?.('a')
    if (anchor) {
      if (dialog.newTab) anchor.setAttribute('target', '_blank')
      else anchor.removeAttribute('target')
      anchor.setAttribute('rel', 'noopener noreferrer')
    }
    emit()
    setLinkDialog(null)
  }

  const unlink = () => command('unlink')

  const uploadInlineImage = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) return alert('Please choose an image smaller than 8 MB.')
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        restoreSelection()
        const result = await api('/api/admin/upload', { method: 'POST', body: JSON.stringify({ data: reader.result }) })
        ref.current?.focus()
        document.execCommand('insertImage', false, result.url)
        emit()
      } catch (error) { alert(error.message) }
    }
    reader.readAsDataURL(file)
  }

  const toolbarButton = (label, onClick, icon = null, title = label) => (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {icon || label}
    </button>
  )

  return (
    <>
      <div className="admin-editor">
        <div className="admin-editor-toolbar">
          <select className="admin-editor-select" aria-label="Font family" defaultValue="" onChange={(event) => applyFontFamily(event.target.value)} onMouseDown={() => saveSelection()}>
            <option value="">Font</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
          </select>
          <select className="admin-editor-select admin-editor-size" aria-label="Font size" defaultValue="" onChange={(event) => applyFontSize(event.target.value)} onMouseDown={() => saveSelection()}>
            <option value="">Size</option>
            {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => <option key={size} value={size}>{size}px</option>)}
          </select>
          {toolbarButton('H2', () => command('formatBlock', 'h2'), null, 'Heading 2')}
          {toolbarButton('H3', () => command('formatBlock', 'h3'), null, 'Heading 3')}
          {toolbarButton('H4', () => command('formatBlock', 'h4'), null, 'Heading 4')}
          {toolbarButton(<strong>B</strong>, () => command('bold'), null, 'Bold')}
          {toolbarButton(<em>I</em>, () => command('italic'), null, 'Italic')}
          {toolbarButton(<span style={{ textDecoration: 'underline' }}>U</span>, () => command('underline'), null, 'Underline')}
          {toolbarButton(<span style={{ textDecoration: 'line-through' }}>S</span>, () => command('strikeThrough'), null, 'Strikethrough')}
          <label className="admin-editor-color" title="Text color"><span>A</span><input type="color" defaultValue="#172033" onMouseDown={() => saveSelection()} onChange={(event) => command('foreColor', event.target.value)} aria-label="Text color" /></label>
          <label className="admin-editor-color admin-editor-highlight" title="Highlight color"><span>H</span><input type="color" defaultValue="#fff2b8" onMouseDown={() => saveSelection()} onChange={(event) => command('hiliteColor', event.target.value)} aria-label="Highlight color" /></label>
          {toolbarButton(<AlignLeft size={15} />, () => command('justifyLeft'), null, 'Align left')}
          {toolbarButton(<AlignCenter size={15} />, () => command('justifyCenter'), null, 'Align center')}
          {toolbarButton(<AlignRight size={15} />, () => command('justifyRight'), null, 'Align right')}
          {toolbarButton(<List size={15} />, () => command('insertUnorderedList'), null, 'Bulleted list')}
          {toolbarButton(<ListOrdered size={15} />, () => command('insertOrderedList'), null, 'Numbered list')}
          {toolbarButton('Quote', () => command('formatBlock', 'blockquote'), null, 'Quote')}
          {toolbarButton(<Link2 size={15} />, openLinkDialog, null, 'Insert or edit link')}
          {toolbarButton('Unlink', unlink, null, 'Remove link')}
          {toolbarButton(<ImageIcon size={15} />, () => { saveSelection(); imageInput.current?.click() }, null, 'Insert image')}
          {toolbarButton(<Undo2 size={15} />, () => command('undo'), null, 'Undo')}
          {toolbarButton(<Redo2 size={15} />, () => command('redo'), null, 'Redo')}
          {toolbarButton(<RemoveFormatting size={15} />, () => command('removeFormat'), null, 'Clear formatting')}
          <input ref={imageInput} type="file" hidden accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => uploadInlineImage(event.target.files?.[0])} />
        </div>
        <div
          ref={ref}
          className="admin-editor-body"
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          onFocus={saveSelection}
        />
      </div>

      {linkDialog && (
        <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setLinkDialog(null) }}>
          <div className="admin-link-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-link-dialog-title">
            <div className="admin-link-dialog-head">
              <div><span>INSERT LINK</span><h3 id="admin-link-dialog-title">Add a link</h3></div>
              <button type="button" className="admin-icon-btn" onClick={() => setLinkDialog(null)} aria-label="Close link dialog"><X size={17} /></button>
            </div>
            <label className="admin-field"><span>URL</span><input autoFocus className="admin-input" value={linkDialog.url} onChange={(event) => setLinkDialog((current) => ({ ...current, url: event.target.value }))} placeholder="https://example.com or /internal-page" onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); applyLink() } }} /></label>
            <label className="admin-field admin-link-text-field"><span>Link text</span><input className="admin-input" value={linkDialog.text} onChange={(event) => setLinkDialog((current) => ({ ...current, text: event.target.value }))} placeholder="Select text in the editor or type text here" onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); applyLink() } }} /></label>
            <label className="admin-link-check"><input type="checkbox" checked={linkDialog.newTab} onChange={(event) => setLinkDialog((current) => ({ ...current, newTab: event.target.checked }))} /> Open link in a new tab</label>
            <p className="admin-link-help">Internal links are supported. You can use paths such as <code>/blog/your-article</code> or <code>/tours/desert-safari/...</code>.</p>
            <div className="admin-form-actions admin-link-dialog-actions">
              <button type="button" className="admin-secondary" onClick={() => setLinkDialog(null)}>Cancel</button>
              <button type="button" className="admin-primary" onClick={applyLink}>Insert link</button>
            </div>
          </div>
        </div>
      )}
    </>
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
      if (form.schemaMode === 'custom') validateJsonLd(form.schemaJsonLd)
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
        <Field label="Focus Keyword"><TextInput value={form.focusKeyword || ''} onChange={(e) => update('focusKeyword', e.target.value)} /></Field>
        <Field label="Robots"><select className="admin-input" value={form.robots || 'index,follow'} onChange={e => update('robots',e.target.value)}><option>index,follow</option><option>noindex,follow</option><option>noindex,nofollow</option><option>index,nofollow</option></select></Field>
      </div>
      <SchemaEditor form={form} update={update} kind="tour" path={`/tours/${slugify(form.category)}/${form.slug || slugify(form.title)}`} />
      <TourImagesEditor
        image={form.image}
        gallery={form.gallery}
        onChange={(list) => setForm((current) => ({ ...current, image: list[0] || '', gallery: list }))}
      />
      <div className="admin-form-grid admin-form-grid--full"><Field label="Full description"><TextArea className="admin-description-textarea" rows={12} value={form.description} onChange={(e) => update('description', e.target.value)} /></Field></div>
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
      if (form.schemaMode === 'custom') validateJsonLd(form.schemaJsonLd)
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
        <Field label="Focus Keyword"><TextInput value={form.focusKeyword || ''} onChange={(e) => update('focusKeyword', e.target.value)} /></Field>
        <Field label="Robots"><select className="admin-input" value={form.robots || 'index,follow'} onChange={e => update('robots',e.target.value)}><option>index,follow</option><option>noindex,follow</option><option>noindex,nofollow</option><option>index,nofollow</option></select></Field>
      </div>
      <SchemaEditor form={form} update={update} kind="blog" path={`/blog/${form.slug || slugify(form.title)}`} />
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
      const [result] = await Promise.all([
        api('/api/admin/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        }),
        animationDelay,
      ])

      setLoginStage('success')
      notify?.('Admin authentication completed successfully.', 'success', 'Admin login')
      window.setTimeout(() => onLogin(result), 1750)
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
    ['dashboard', LayoutDashboard, 'Dashboard'], ['tours', FileText, 'Tours & Packages'], ['blogs', BookOpen, 'Blog / Articles'], ['seo-pages', Settings, 'SEO Pages & Schema'], ['reviews', Star, 'Reviews'],
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
          <header className="admin-topbar"><button className="admin-mobile-menu" onClick={() => setMobileNav(!mobileNav)}><Menu size={20} /></button><div><span>TRIPSCAPE ADVENTURES · ADMIN PANEL</span><strong>{section === 'dashboard' ? 'Dashboard' : section === 'tours' ? 'Tours & Packages' : section === 'blogs' ? 'Blog / Articles' : section === 'seo-pages' ? 'SEO Pages & Schema' : 'Reviews'}</strong></div><a href="/" className="admin-site-link">View website <ChevronLeft size={15} /></a></header>
          <main className="admin-page">
            {section === 'dashboard' && <DashboardHome stats={stats} />}
            {section === 'tours' && <ToursManager onChanged={loadStats} notify={notify} />}
            {section === 'blogs' && <BlogsManager onChanged={loadStats} notify={notify} />}
            {section === 'reviews' && <ReviewsManager onChanged={loadStats} notify={notify} />}
            {section === 'seo-pages' && <SeoPagesManager notify={notify} />}
          </main>
        </div>
      </div>
    </>
  )
}
