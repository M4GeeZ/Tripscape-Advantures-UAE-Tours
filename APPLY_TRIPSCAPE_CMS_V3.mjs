
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.argv[2] || process.cwd())
const p = (...parts) => path.join(root, ...parts)
const files = {
  security: p('server','src','utils','security.js'),
  tourModel: p('server','src','models','Tour.js'),
  adminRoute: p('server','src','routes','admin.js'),
  toursRoute: p('server','src','routes','tours.js'),
  adminApp: p('client','src','pages','Admin','AdminApp.jsx'),
  adminCss: p('client','src','pages','Admin','Admin.css'),
  tourCarousel: p('client','src','components','TourCarousel','TourCarousel.jsx'),
  toursPage: p('client','src','pages','Tours','Tours.jsx'),
  tourCategory: p('client','src','pages','TourCategory','TourCategory.jsx'),
  campaignLanding: p('client','src','pages','CampaignLanding','CampaignLanding.jsx'),
  servicesPage: p('client','src','pages','Services','Services.jsx'),
}
const read = f => fs.readFileSync(f,'utf8')
const write = (f,s) => fs.writeFileSync(f,s,'utf8')
const backupDir = p(`.tripscape-cms-v3-backup-${new Date().toISOString().replace(/[-:TZ.]/g,'').slice(0,14)}`)
fs.mkdirSync(backupDir,{recursive:true})
for (const [k,f] of Object.entries(files)) if (fs.existsSync(f)) fs.copyFileSync(f,path.join(backupDir,`${k}-${path.basename(f)}`))
const changed=[]

let s=read(files.security)
const cookieOld="res.setHeader('Set-Cookie', `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TOKEN_TTL_SECONDS}${secure ? '; Secure' : ''}`)"
const cookieNew="res.setHeader('Set-Cookie', `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`)"
if(s.includes(cookieOld)){s=s.replace(cookieOld,cookieNew);changed.push('admin cookie changed to session cookie')}
write(files.security,s)

s=read(files.tourModel)
if(!s.includes('placements: {')){
  const a="  sortOrder: { type: Number, default: 0, index: true },"
  const b=`  placements: {
    home: { type: Boolean, default: false },
    allTours: { type: Boolean, default: true },
    services: { type: Boolean, default: false },
    paths: { type: [String], default: [] },
  },
${a}`
  if(!s.includes(a)) throw new Error('Tour model anchor not found')
  s=s.replace(a,b);changed.push('tour placements added')
}
write(files.tourModel,s)

s=read(files.adminRoute)
if(!s.includes('function cleanPlacements(')){
  const a="async function uniqueSlug(Model, requested, id = null) {"
  const b=`function cleanPlacements(value) {
  const source = value && typeof value === 'object' ? value : {}
  const paths = Array.isArray(source.paths) ? source.paths.map((item) => cleanString(item, 500)).map((item) => {
    try { return new URL(item, 'https://tripscapetourism.com').pathname.replace(/\\\\/+$/, '') || '/' }
    catch { return '' }
  }).filter(Boolean).slice(0, 30) : []
  return {
    home: Boolean(source.home),
    allTours: source.allTours !== false,
    services: Boolean(source.services),
    paths,
  }
}

${a}`
  if(!s.includes(a)) throw new Error('admin route uniqueSlug anchor not found')
  s=s.replace(a,b)
}
s=s.replace("included: cleanList(body.included), excluded: cleanList(body.excluded),","included: cleanList(body.included, 30, 3000), excluded: cleanList(body.excluded, 30, 3000),")
s=s.replace("featured: Boolean(body.featured), published: body.published !== false,","featured: Boolean(body.featured), published: body.published !== false,\n    placements: cleanPlacements(body.placements),")
const uploadOld="const match = dataUrl.match(/^data:(image\\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/i)"
const uploadNew="const match = dataUrl.match(/^data:(image\\/(?:jpeg|png|webp|gif|avif|bmp|tiff|x-icon|vnd\\.microsoft\\.icon));base64,([A-Za-z0-9+/=]+)$/i)"
if(s.includes(uploadOld)){
  s=s.replace(uploadOld,uploadNew)
  s=s.replace("Only JPG, PNG, WEBP or GIF images are allowed.","Please choose a supported image file.")
  s=s.replace("const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[match[1].toLowerCase()]",
    "const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif', 'image/bmp': 'bmp', 'image/tiff': 'tiff', 'image/x-icon': 'ico', 'image/vnd.microsoft.icon': 'ico' }[match[1].toLowerCase()]")
  changed.push('image upload formats expanded')
}
write(files.adminRoute,s)

s=read(files.toursRoute)
if(!s.includes('placements: {')){
  const a="    categorySlug: tour.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),"
  const b=`${a}
    placements: {
      home: Boolean(tour.placements?.home),
      allTours: tour.placements?.allTours !== false,
      services: Boolean(tour.placements?.services),
      paths: Array.isArray(tour.placements?.paths) ? tour.placements.paths : [],
    },`
  if(!s.includes(a)) throw new Error('public tours map anchor not found')
  s=s.replace(a,b);changed.push('public tour API exposes placements')
}
write(files.toursRoute,s)

s=read(files.adminApp)
const oldMedia=`function adminMediaUrl(value) {
  const source = String(value || '')
  if (source.startsWith('/uploads/')) return apiUrl(\`/uploads/\${source.slice('/uploads/'.length)}\`)
  return source
}`
const newMedia=`function adminMediaUrl(value) {
  const source = String(value || '')
  if (source.startsWith('/api/uploads/')) return apiUrl(source)
  if (source.startsWith('/uploads/')) return apiUrl(\`/uploads/\${source.slice('/uploads/'.length)}\`)
  return source
}`
if(s.includes(oldMedia)) s=s.replace(oldMedia,newMedia)
if(!s.includes("placements: { home: false")){
  const a="  featured: false, published: true, seoTitle: '', metaDescription: '', canonical: ''"
  if(!s.includes(a)) throw new Error('EMPTY_TOUR anchor not found')
  s=s.replace(a,a+",\n  placements: { home: false, allTours: true, services: false, paths: [] }")
}
s=s.replace('accept="image/jpeg,image/png,image/webp,image/gif"','accept="image/*"')
if(!s.includes('className="admin-list-textarea"')){
  const rx=/(<div className="admin-list-row" key=\{`\$\{index\}-\$\{item\}`\}>\s*)<TextInput value=\{item\} placeholder=\{placeholder\} onChange=\{\(event\) => update\(index, event\.target\.value\)\} \/>/
  if(!rx.test(s)) throw new Error('ListEditor input not found')
  s=s.replace(rx,'$1<TextArea className="admin-list-textarea" rows={5} value={item} placeholder={placeholder} onChange={(event) => update(index, event.target.value)} />')
}
if(!s.includes('function TourPlacementEditor(')){
  const a="function TourForm({ initial, onSaved, onCancel, notify }) {"
  const b=`function TourPlacementEditor({ value, onChange }) {
  const placement = value && typeof value === 'object' ? value : {}
  const paths = Array.isArray(placement.paths) ? placement.paths : []
  const update = (key, next) => onChange({ ...placement, [key]: next })
  return (
    <section className="admin-placement-box">
      <div className="admin-placement-head">
        <span>TOUR CARD VISIBILITY</span>
        <h3>Where should this package appear?</h3>
        <p>Select every location where you want this tour card to be displayed.</p>
      </div>
      <div className="admin-placement-options">
        <label><input type="checkbox" checked={Boolean(placement.home)} onChange={(e) => update('home', e.target.checked)} /> Home page</label>
        <label><input type="checkbox" checked={placement.allTours !== false} onChange={(e) => update('allTours', e.target.checked)} /> All Tours</label>
        <label><input type="checkbox" checked={Boolean(placement.services)} onChange={(e) => update('services', e.target.checked)} /> Services page</label>
      </div>
      <div className="admin-placement-specific">
        <div className="admin-placement-specific-head">
          <div><strong>Specific page URL</strong><small>Add any Tripscape page where this card should appear.</small></div>
          <button type="button" className="admin-add-link" onClick={() => update('paths', [...paths, ''])}>+ Add page</button>
        </div>
        {!paths.length && <div className="admin-placement-empty">No specific page selected. Example: <code>/tours/dune-buggy/</code></div>}
        {paths.map((item, index) => (
          <div className="admin-placement-path" key={index}>
            <TextInput value={item} onChange={(e) => update('paths', paths.map((x,i) => i === index ? e.target.value : x))} placeholder="/tours/dune-buggy/" />
            <button type="button" className="admin-icon-btn danger" onClick={() => update('paths', paths.filter((_,i) => i !== index))} aria-label="Remove page"><Trash2 size={15} /></button>
          </div>
        ))}
        <p className="admin-placement-help">Use the website path only, for example <code>/tours/dune-buggy/</code>.</p>
      </div>
    </section>
  )
}

${a}`
  if(!s.includes(a)) throw new Error('TourForm anchor not found')
  s=s.replace(a,b)
}
if(!s.includes('<TourPlacementEditor value={form.placements}')){
  const a="      <FaqEditor faqs={form.faqs} onChange={(value) => update('faqs', value)} />"
  if(!s.includes(a)) throw new Error('TourForm FAQ anchor not found')
  s=s.replace(a,"      <TourPlacementEditor value={form.placements} onChange={(value) => update('placements', value)} />\n"+a)
}
if(!s.includes('TRIPSCAPE_ADMIN_CLOSE_LOGOUT')){
  const a="  useEffect(() => {\n    api('/api/admin/auth/me').then(setAuth).catch(() => setAuth(null)).finally(() => setChecking(false))\n  }, [])"
  const b=`${a}
  useEffect(() => {
    const logoutOnClose = () => {
      try {
        fetch(apiUrl('/api/admin/auth/logout'), { method: 'POST', credentials: 'include', keepalive: true })
      } catch {}
    }
    window.addEventListener('beforeunload', logoutOnClose)
    return () => window.removeEventListener('beforeunload', logoutOnClose)
  }, []) // TRIPSCAPE_ADMIN_CLOSE_LOGOUT`
  if(!s.includes(a)) throw new Error('Admin auth check effect not found')
  s=s.replace(a,b)
}
write(files.adminApp,s)

s=read(files.adminCss)
if(!s.includes('.admin-list-textarea')){
  s += `

/* Tour CMS placement and long-text controls */
.admin-list-textarea { min-height: 120px; resize: vertical; line-height: 1.55; white-space: pre-wrap; }
.admin-placement-box { margin-top: 25px; padding: 18px; border: 1px solid rgba(17,27,43,.10); border-radius: 13px; background: #fbfaf7; }
.admin-placement-head span { display:block; color:#b0823c; font-size:9px; font-weight:900; letter-spacing:.14em; }
.admin-placement-head h3 { margin:6px 0 0; color:#172033; font-size:17px; }
.admin-placement-head p,.admin-placement-help,.admin-placement-specific small { color:#8a9098; font-size:10px; line-height:1.6; }
.admin-placement-options { display:flex; flex-wrap:wrap; gap:18px 24px; margin-top:16px; padding-top:15px; border-top:1px solid rgba(17,27,43,.08); }
.admin-placement-options label { display:inline-flex; align-items:center; gap:7px; color:#555d68; font-size:11px; font-weight:800; }
.admin-placement-options input { accent-color:#c98b2e; }
.admin-placement-specific { margin-top:18px; }
.admin-placement-specific-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
.admin-placement-specific-head strong { display:block; color:#4e5661; font-size:11px; }
.admin-placement-path { display:grid; grid-template-columns:1fr 38px; gap:8px; margin-top:10px; }
.admin-placement-empty { margin-top:10px; padding:10px 12px; border-radius:9px; background:#fff; color:#8a9098; font-size:10px; }
.admin-placement-empty code,.admin-placement-help code { color:#735526; background:#f3ede2; border-radius:4px; padding:2px 4px; }
@media(max-width:700px){.admin-placement-box{padding:15px}.admin-placement-specific-head{flex-direction:column}}
`
}
write(files.adminCss,s)

s=read(files.tourCarousel)
s=s.replace(
"setDynamicTours(Array.isArray(items) ? items.filter((item) => item?.published !== false && item?.featured) : [])",
"setDynamicTours(Array.isArray(items) ? items.filter((item) => item?.published !== false && (item?.featured || item?.placements?.home)) : [])")
write(files.tourCarousel,s)

const componentDir=p('client','src','components','CmsTourPlacements')
fs.mkdirSync(componentDir,{recursive:true})
write(path.join(componentDir,'CmsTourPlacements.jsx'),`import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, Clock3, Star } from 'lucide-react'
import { apiUrl } from '../../utils/apiBaseUrl'
import { getTourDetailHref } from '../../tourDetails'
import { getCardPoints } from '../../utils/cardContent'
import './CmsTourPlacements.css'

const normalizePath = (value='') => {
  const clean = String(value).split('?')[0].split('#')[0]
  return clean.replace(/\\\\/+$/, '') || '/'
}
const mediaUrl = (value='') => {
  const source=String(value||'')
  if(source.startsWith('/api/uploads/')) return apiUrl(source)
  if(source.startsWith('/uploads/')) return apiUrl('/uploads/'+source.slice('/uploads/'.length))
  return source
}
function PlacementCard({tour}){
  const href=tour.href || (tour.slug && tour.categorySlug ? '/tours/'+tour.categorySlug+'/'+tour.slug : getTourDetailHref(tour.category||'Desert Safari',tour.title))
  const points=tour.included?.filter(Boolean).slice(0,5)
  const fallback=getCardPoints(tour.category||'Desert Safari',tour.title,tour.description||'',5)
  return <article className="cms-placement-card">
    <a href={href} className="cms-placement-card__image"><img src={mediaUrl(tour.image)} alt={tour.title} loading="lazy"/>{tour.duration&&<span><Clock3 size={13}/>{tour.duration}</span>}</a>
    <div className="cms-placement-card__body">
      <div className="cms-placement-card__rating"><Star size={13} fill="currentColor"/>{tour.rating||'4.9'} · {tour.reviews??0} reviews</div>
      <h3>{tour.title}</h3>
      <ul>{(points?.length?points:fallback).map(point=><li key={point}><Check size={14}/><span>{point}</span></li>)}</ul>
      <div className="cms-placement-card__footer"><strong>{tour.price||'Contact for price'}</strong><a href={href}>View package <ArrowRight size={15}/></a></div>
    </div>
  </article>
}
export default function CmsTourPlacements({path}){
  const [tours,setTours]=useState([])
  useEffect(()=>{
    fetch(apiUrl('/api/tours')).then(r=>r.ok?r.json():[]).then(items=>{
      const current=normalizePath(path||window.location.pathname)
      setTours(Array.isArray(items)?items.filter(t=>t?.published!==false&&Array.isArray(t?.placements?.paths)&&t.placements.paths.some(x=>normalizePath(x)===current)):[])
    }).catch(()=>setTours([]))
  },[path])
  const unique=useMemo(()=>{const seen=new Set();return tours.filter(t=>{const k=String(t._id||t.id||t.title).toLowerCase();if(seen.has(k))return false;seen.add(k);return true})},[tours])
  if(!unique.length)return null
  return <section className="cms-placement-section"><div className="container"><div className="cms-placement-section__head"><span>MORE TO EXPLORE</span><h2>More packages for this page</h2></div><div className="cms-placement-grid">{unique.map(t=><PlacementCard key={t._id||t.id||t.title} tour={t}/>)}</div></div></section>
}
`)
write(path.join(componentDir,'CmsTourPlacements.css'),`.cms-placement-section{padding:78px 0;background:#f8f6f1}.cms-placement-section__head{margin-bottom:28px}.cms-placement-section__head span{display:block;margin-bottom:7px;color:#b0823c;font-size:10px;font-weight:900;letter-spacing:.14em}.cms-placement-section__head h2{margin:0;color:#172033;font-size:clamp(28px,4vw,46px);line-height:1.08}.cms-placement-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.cms-placement-card{overflow:hidden;border:1px solid rgba(17,27,43,.09);border-radius:18px;background:#fff;box-shadow:0 14px 38px rgba(17,27,43,.07)}.cms-placement-card__image{position:relative;display:block;height:230px;overflow:hidden}.cms-placement-card__image img{width:100%;height:100%;display:block;object-fit:cover}.cms-placement-card__image>span{position:absolute;right:12px;top:12px;display:inline-flex;align-items:center;gap:5px;padding:7px 10px;border-radius:999px;background:rgba(255,255,255,.95);color:#172033;font-size:10px;font-weight:800}.cms-placement-card__body{padding:18px}.cms-placement-card__rating{color:#b07a25;font-size:10px;font-weight:800}.cms-placement-card h3{margin:8px 0 13px;color:#172033;font-size:19px;line-height:1.25}.cms-placement-card ul{margin:0;padding:0;list-style:none;display:grid;gap:7px}.cms-placement-card li{display:flex;align-items:flex-start;gap:7px;color:#727985;font-size:10px;line-height:1.45}.cms-placement-card li svg{flex:0 0 auto;margin-top:1px;color:#c98b2e}.cms-placement-card__footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px;padding-top:14px;border-top:1px solid rgba(17,27,43,.08)}.cms-placement-card__footer strong{color:#c98b2e;font-size:15px}.cms-placement-card__footer a{display:inline-flex;align-items:center;gap:5px;color:#172033;font-size:10px;font-weight:800;text-decoration:none}@media(max-width:900px){.cms-placement-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.cms-placement-grid{grid-template-columns:1fr}.cms-placement-section{padding:58px 0}}`)

for key in ['campaignLanding','tourCategory','toursPage']:
  s=read(files[key])
  import_anchor = "import { apiUrl } from '../../utils/apiBaseUrl'" if key in ['campaignLanding','toursPage'] else "import { getCardPoints } from '../../utils/cardContent'"
  if "CmsTourPlacements" not in s:
    s=s.replace(import_anchor,import_anchor+"\nimport CmsTourPlacements from '../../components/CmsTourPlacements/CmsTourPlacements'")
  if "<CmsTourPlacements path={window.location.pathname}" not in s:
    if key=='campaignLanding':
      anchor='<div className="category-reviews-wrap"'
      s=s.replace(anchor,'<CmsTourPlacements path={window.location.pathname} />\n        '+anchor,1)
    elif key=='tourCategory':
      anchor='<div className="category-reviews-wrap"'
      s=s.replace(anchor,'<CmsTourPlacements path={window.location.pathname} />\n        '+anchor,1)
    else:
      anchor='      </main>'
      s=s.replace(anchor,'        <CmsTourPlacements path={window.location.pathname} />\n'+anchor,1)
  write(files[key],s)


// 10) Services page supports the Services checkbox as well as a specific URL.
{
  let s=read(files.servicesPage)
  if (!s.includes("import CmsTourPlacements from '../../components/CmsTourPlacements/CmsTourPlacements'")) {
    const anchor="import { apiUrl } from '../../utils/apiBaseUrl'"
    if (s.includes(anchor)) {
      s=s.replace(anchor,anchor+"\nimport CmsTourPlacements from '../../components/CmsTourPlacements/CmsTourPlacements'")
    } else {
      const fallback="import './Services.css'"
      if (!s.includes(fallback)) throw new Error('Could not locate Services import anchor')
      s=s.replace(fallback,"import CmsTourPlacements from '../../components/CmsTourPlacements/CmsTourPlacements'\n"+fallback)
    }
  }
  if (!s.includes('<CmsTourPlacements path={window.location.pathname}')) {
    const anchors=['      </main>','    </main>']
    let done=false
    for (const anchor of anchors) {
      if (s.includes(anchor)) {
        s=s.replace(anchor,'        <CmsTourPlacements path={window.location.pathname} />\n'+anchor,1)
        done=true
        break
      }
    }
    if (!done) throw new Error('Could not locate Services main closing tag')
  }
  write(files.servicesPage,s)
  changed.push('Services page supports CMS placement cards')
}

console.log('[Tripscape CMS v3] Backup:', backupDir)
console.log('[Tripscape CMS v3] Changed:', changed.length)
changed.forEach(x=>console.log(' -',x))
console.log('[Tripscape CMS v3] Done.')
