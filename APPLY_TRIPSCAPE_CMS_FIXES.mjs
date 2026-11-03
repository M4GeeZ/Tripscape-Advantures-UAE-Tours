import fs from 'node:fs'
import path from 'node:path'

const candidates = [
  String.raw`D:\Internship Projects\Quelogics\tripscape\tripscape-mern`,
  String.raw`D:\Internship Projects\Quelogics\tripscape\new folder\tripscape-mern`,
  String.raw`D:\Internship Projects\Quelogics\tripscape\tripscape-mern-clean`,
]

function die(message) {
  console.error(`\n[Tripscape patch] ${message}\n`)
  process.exit(1)
}

function projectLooksRight(root) {
  return fs.existsSync(path.join(root, 'client', 'src', 'pages', 'Admin', 'AdminApp.jsx')) &&
    fs.existsSync(path.join(root, 'server', 'src', 'routes', 'admin.js')) &&
    fs.existsSync(path.join(root, 'server', 'src', 'models', 'Tour.js'))
}

const requestedRoot = process.argv[2] ? path.resolve(process.argv[2]) : ''
const root = requestedRoot || candidates.find(projectLooksRight)

if (!root || !projectLooksRight(root)) {
  die('Project root not found. Run: node APPLY_TRIPSCAPE_CMS_FIXES.mjs "D:\\path\\to\\tripscape-mern"')
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const backupRoot = path.join(root, `.tripscape-backup-${timestamp}`)

const files = {
  adminApp: path.join(root, 'client', 'src', 'pages', 'Admin', 'AdminApp.jsx'),
  adminCss: path.join(root, 'client', 'src', 'pages', 'Admin', 'Admin.css'),
  apiBase: path.join(root, 'client', 'src', 'utils', 'apiBaseUrl.js'),
  tourCard: path.join(root, 'client', 'src', 'components', 'TourCard', 'TourCard.jsx'),
  tourCarousel: path.join(root, 'client', 'src', 'components', 'TourCarousel', 'TourCarousel.jsx'),
  tourCategory: path.join(root, 'client', 'src', 'pages', 'TourCategory', 'TourCategory.jsx'),
  campaignLanding: path.join(root, 'client', 'src', 'pages', 'CampaignLanding', 'CampaignLanding.jsx'),
  services: path.join(root, 'client', 'src', 'pages', 'Services', 'Services.jsx'),
  tourDetail: path.join(root, 'client', 'src', 'pages', 'TourDetail', 'TourDetail.jsx'),
  blogSection: path.join(root, 'client', 'src', 'components', 'BlogSection', 'BlogSection.jsx'),
  security: path.join(root, 'server', 'src', 'utils', 'security.js'),
  adminAuth: path.join(root, 'server', 'src', 'routes', 'adminAuth.js'),
  adminRoute: path.join(root, 'server', 'src', 'routes', 'admin.js'),
  tourModel: path.join(root, 'server', 'src', 'models', 'Tour.js'),
}

for (const [key, file] of Object.entries(files)) {
  if (!fs.existsSync(file)) die(`Missing expected file for ${key}: ${file}`)
}

function read(file) {
  return fs.readFileSync(file, 'utf8')
}

function write(file, value) {
  fs.writeFileSync(file, value, 'utf8')
}

function backup(file) {
  const relative = path.relative(root, file)
  const destination = path.join(backupRoot, relative)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(file, destination)
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function replaceOnce(file, pattern, replacement, label, flags = '') {
  const source = read(file)
  const regex = pattern instanceof RegExp ? pattern : new RegExp(escapeRegExp(pattern), flags)
  if (!regex.test(source)) die(`Could not find expected code for ${label} in ${path.relative(root, file)}`)
  const next = source.replace(regex, replacement)
  write(file, next)
}

for (const file of Object.values(files)) backup(file)
fs.mkdirSync(backupRoot, { recursive: true })

/* -----------------------------------------------------------------------
   1) Shared media URL normalization.
   /api/uploads/... must go through apiUrl() so Vercel does not request the
   upload from the Vercel frontend origin.
------------------------------------------------------------------------ */
replaceOnce(
  files.apiBase,
  /export function apiUrl\(pathname\) \{[\s\S]*?\n\}/,
  `export function apiUrl(pathname) {
  const path = pathname.startsWith('/') ? pathname : \`/\${pathname}\`
  return \`\${getApiBaseUrl()}\${path}\`
}

export function mediaUrl(value) {
  const source = String(value || '').trim()
  if (!source) return ''
  if (/^data:image\\//i.test(source)) return source
  if (/^https?:\\/\\//i.test(source)) return source
  if (source.startsWith('/api/uploads/')) return apiUrl(source)
  if (source.startsWith('/uploads/')) return apiUrl(\`/api\${source}\`)
  return source
}`,
  'mediaUrl helper',
)

replaceOnce(
  files.adminApp,
  `import { apiUrl } from '../../utils/apiBaseUrl'`,
  `import { apiUrl, mediaUrl } from '../../utils/apiBaseUrl'`,
  'AdminApp media import',
)

replaceOnce(
  files.adminApp,
  /function adminMediaUrl\(value\) \{[\s\S]*?\n\}/,
  `function adminMediaUrl(value) {
  return mediaUrl(value)
}`,
  'AdminApp media URL helper',
)

replaceOnce(
  files.tourCard,
  `import { getCardPoints } from '../../utils/cardContent'`,
  `import { getCardPoints } from '../../utils/cardContent'
import { mediaUrl } from '../../utils/apiBaseUrl'`,
  'TourCard media import',
)
replaceOnce(
  files.tourCard,
  `src={tour.image}`,
  `src={mediaUrl(tour.image)}`,
  'TourCard image source',
)

replaceOnce(
  files.tourCarousel,
  `import { apiUrl } from '../../utils/apiBaseUrl'`,
  `import { apiUrl, mediaUrl } from '../../utils/apiBaseUrl'`,
  'TourCarousel media import',
)
replaceOnce(
  files.tourCarousel,
  `image: tour.featuredImage || featuredImagesByTitle[sourceTitle] || tour.image,`,
  `image: mediaUrl(tour.featuredImage || featuredImagesByTitle[sourceTitle] || tour.image),`,
  'TourCarousel image normalization',
)
replaceOnce(
  files.tourCarousel,
  `item?.published !== false && item?.featured`,
  `item?.published !== false && (item?.placements?.home || item?.featured || item?.placements?.specificUrls?.includes('/'))`,
  'homepage placement filter',
)

replaceOnce(
  files.tourCarousel,
  /  const displayedTours = useMemo\(\(\) => \{[\s\S]*?\n  \}, \[dynamicLoaded, dynamicTours\]\)/,
  `  const displayedTours = useMemo(() => {
    const staticBase = getStaticFallback()
    const selectedDynamic = dynamicTours.filter((item) => item?.published !== false && (item?.placements?.home || item?.featured))
    const dynamicByTitle = new Map(
      selectedDynamic.map((item) => [String(item.sourceTitle || item.title || '').trim().toLowerCase(), item])
    )

    const mergedBase = staticBase.map((tour) => {
      const key = String(tour.sourceTitle || tour.title || '').trim().toLowerCase()
      const dynamic = dynamicByTitle.get(key)
      return dynamic ? { ...tour, ...dynamic } : tour
    })

    const existingKeys = new Set(mergedBase.map((tour) => String(tour.sourceTitle || tour.title || '').trim().toLowerCase()))
    const extras = selectedDynamic.filter((tour) => {
      const key = String(tour.sourceTitle || tour.title || '').trim().toLowerCase()
      if (!key || existingKeys.has(key)) return false
      existingKeys.add(key)
      return true
    })

    return [...mergedBase, ...extras].map((tour) => {
      const sourceTitle = tour.sourceTitle || tour.title
      const detailHref = tour.href || (tour.slug && tour.categorySlug
        ? \`/tours/\${tour.categorySlug}/\${tour.slug}\`
        : getTourDetailHref(tour.category || 'Desert Safari', sourceTitle))
      const points = tour.points?.length
        ? tour.points.slice(0, 5)
        : tour.included?.length
          ? tour.included.slice(0, 5)
          : getCardPoints(tour.category || 'Desert Safari', sourceTitle, tour.description || '', 5)
      const isDreamscape = tour.title === 'The Desert Dreamscape'

      return {
        ...tour,
        detailHref,
        points,
        image: mediaUrl(tour.featuredImage || featuredImagesByTitle[sourceTitle] || tour.image),
        displayTitle: isDreamscape ? 'The Desert Dreamscape Ultra Romantic Private Setup' : tour.title,
        isDreamscape,
      }
    })
  }, [dynamicLoaded, dynamicTours])`,
  'homepage append/merge behavior',
)

/* -----------------------------------------------------------------------
   2) Admin authentication: session cookie instead of persistent cookie.
   /me re-issues it as a session cookie, which also upgrades an old
   persistent cookie after the first authenticated load.
------------------------------------------------------------------------ */
replaceOnce(
  files.security,
  /res\.setHeader\('Set-Cookie', `\$\{TOKEN_COOKIE\}=\$\{encodeURIComponent\(token\)\}; Path=\/; HttpOnly; SameSite=Lax; Max-Age=\$\{TOKEN_TTL_SECONDS\}\$\{secure \? '; Secure' : ''\}`\)/,
  `res.setHeader('Set-Cookie', \`\${TOKEN_COOKIE}=\${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax\${secure ? '; Secure' : ''}\`)`,
  'session admin cookie',
)

replaceOnce(
  files.adminAuth,
  /router\.get\('\/me', requireAdmin, \(req, res\) => \{\n\s*res\.json\(\{ authenticated: true, email: req\.admin\.email \}\)\n\}\)/,
  `router.get('/me', requireAdmin, (req, res) => {
  // Re-issue as a browser-session cookie so older persistent cookies are upgraded too.
  setAdminCookie(res, createAdminToken(req.admin.email))
  res.json({ authenticated: true, email: req.admin.email })
})`,
  'admin auth /me session refresh',
)

/* -----------------------------------------------------------------------
   3) Tour model + API placement data.
   Base behavior stays: published tours are available in All Tours and
   their matching category. Extra placements are explicit.
------------------------------------------------------------------------ */
replaceOnce(
  files.tourModel,
  `  faqs: { type: [faqSchema], default: [] },
  featured: { type: Boolean, default: false },`,
  `  faqs: { type: [faqSchema], default: [] },
  placements: {
    home: { type: Boolean, default: false },
    services: { type: Boolean, default: false },
    categoryPages: { type: [String], default: [] },
    campaignPages: { type: [String], default: [] },
    specificUrls: { type: [String], default: [] },
  },
  featured: { type: Boolean, default: false },`,
  'Tour model placements',
)

replaceOnce(
  files.adminRoute,
  `function cleanList(value, maxItems = 30, maxLength = 500) {
  if (!Array.isArray(value)) return []
  return value.map((item) => cleanString(item, maxLength)).filter(Boolean).slice(0, maxItems)
}`,
  `function cleanList(value, maxItems = 30, maxLength = 500) {
  if (!Array.isArray(value)) return []
  return value.map((item) => cleanString(item, maxLength)).filter(Boolean).slice(0, maxItems)
}

const PLACEMENT_CATEGORY_SLUGS = new Set([
  'desert-adventures',
  'city-tours',
  'attractions',
  'cruises',
  'water-activities',
  'aerial-experiences',
  'packages',
])

const PLACEMENT_CAMPAIGN_PATHS = new Set([
  '/tours/desert-safari',
  '/tours/evening-desert-safari',
  '/tours/quad-bike',
  '/tours/dune-buggy',
  '/tours/private-desert-setup',
  '/tours/desert-safari/private-desert-safari-packages',
])

function normalizePlacementPath(value) {
  let source = cleanString(value, 500)
  if (!source) return ''
  try {
    if (/^https?:\\/\\//i.test(source)) {
      const parsed = new URL(source)
      if (!['http:', 'https:'].includes(parsed.protocol)) return ''
      if (!['tripscapetourism.com', 'www.tripscapetourism.com'].includes(parsed.hostname.toLowerCase())) return ''
      source = parsed.pathname
    }
  } catch {
    return ''
  }
  if (!source.startsWith('/')) source = \`/\${source}\`
  return source.replace(/\\/{2,}/g, '/').replace(/\\/$/, '') || '/'
}

function cleanPlacements(value) {
  const source = value && typeof value === 'object' ? value : {}
  const categoryPages = Array.isArray(source.categoryPages)
    ? [...new Set(source.categoryPages.map((item) => cleanString(item, 80)).filter((item) => PLACEMENT_CATEGORY_SLUGS.has(item)))]
    : []
  const campaignPages = Array.isArray(source.campaignPages)
    ? [...new Set(source.campaignPages.map(normalizePlacementPath).filter((item) => PLACEMENT_CAMPAIGN_PATHS.has(item)))]
    : []
  const specificUrls = Array.isArray(source.specificUrls)
    ? [...new Set(source.specificUrls.map(normalizePlacementPath).filter(Boolean))]
    : []

  return {
    home: Boolean(source.home),
    services: Boolean(source.services),
    categoryPages: categoryPages.slice(0, 20),
    campaignPages: campaignPages.slice(0, 20),
    specificUrls: specificUrls.slice(0, 20),
  }
}`,
  'admin placement helpers',
)

replaceOnce(
  files.adminRoute,
  `    faqs: tour.faqs,
    featured: tour.featured,`,
  `    faqs: tour.faqs,
    placements: tour.placements || { home: false, services: false, categoryPages: [], campaignPages: [], specificUrls: [] },
    featured: tour.featured,`,
  'admin mapTour placements',
)

replaceOnce(
  files.adminRoute,
  `    included: cleanList(body.included), excluded: cleanList(body.excluded), faqs: cleanFaqs(body.faqs),
    featured: Boolean(body.featured), published: body.published !== false,`,
  `    included: cleanList(body.included, 30, 3000), excluded: cleanList(body.excluded, 30, 3000), faqs: cleanFaqs(body.faqs),
    placements: cleanPlacements(body.placements),
    featured: Boolean(body.featured || body.placements?.home), published: body.published !== false,`,
  'admin create tour placements and long lists',
)

replaceOnce(
  files.adminRoute,
  `    included: cleanList(body.included), excluded: cleanList(body.excluded), faqs: cleanFaqs(body.faqs),
    featured: Boolean(body.featured), published: body.published !== false,`,
  `    included: cleanList(body.included, 30, 3000), excluded: cleanList(body.excluded, 30, 3000), faqs: cleanFaqs(body.faqs),
    placements: cleanPlacements(body.placements),
    featured: Boolean(body.featured || body.placements?.home), published: body.published !== false,`,
  'admin update tour placements and long lists',
)

replaceOnce(
  files.adminRoute,
  `  const match = dataUrl.match(/^data:(image\\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/i)
  if (!match) return res.status(400).json({ message: 'Only JPG, PNG, WEBP or GIF images are allowed.' })`,
  `  const match = dataUrl.match(/^data:(image\\/[^;]+);base64,([A-Za-z0-9+/=]+)$/i)
  if (!match) return res.status(400).json({ message: 'Please upload a valid image file.' })`,
  'broad image MIME validation',
)

replaceOnce(
  files.adminRoute,
  `  const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[match[1].toLowerCase()]`,
  `  const extension = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/apng': 'apng',
    'image/avif': 'avif',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'image/x-icon': 'ico',
    'image/vnd.microsoft.icon': 'ico',
  }[match[1].toLowerCase()]
  if (!extension) return res.status(415).json({ message: 'This image format is not supported by the upload service.' })`,
  'image MIME extension map',
)

/* -----------------------------------------------------------------------
   4) Admin UI: placement controls, all-image accept, multiline
      inclusions/exclusions, and correct preview/list image URLs.
------------------------------------------------------------------------ */
replaceOnce(
  files.adminApp,
  `  faqs: [{ question: '', answer: '' }],
  featured: false, published: true, seoTitle: '', metaDescription: '', canonical: ''`,
  `  faqs: [{ question: '', answer: '' }],
  placements: { home: false, services: false, categoryPages: [], campaignPages: [], specificUrls: [] },
  featured: false, published: true, seoTitle: '', metaDescription: '', canonical: ''`,
  'EMPTY_TOUR placements',
)

replaceOnce(
  files.adminApp,
  `<input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={(event) => upload(event.target.files?.[0])} />`,
  `<input ref={inputRef} type="file" accept="image/*" hidden onChange={(event) => upload(event.target.files?.[0])} />`,
  'main image accept',
)

replaceOnce(
  files.adminApp,
  `<input ref={imageInput} type="file" hidden accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => uploadInlineImage(event.target.files?.[0])} />`,
  `<input ref={imageInput} type="file" hidden accept="image/*" onChange={(event) => uploadInlineImage(event.target.files?.[0])} />`,
  'inline image accept',
)

replaceOnce(
  files.adminApp,
  `<TextInput value={item} placeholder={placeholder} onChange={(event) => update(index, event.target.value)} />`,
  `<textarea className="admin-input admin-textarea admin-list-textarea" rows={4} value={item} placeholder={placeholder} onChange={(event) => update(index, event.target.value)} />`,
  'multiline inclusion exclusion editor',
)

replaceOnce(
  files.adminApp,
  `function FaqEditor({ faqs, onChange }) {`,
  `const PLACEMENT_CATEGORIES = [
  ['desert-adventures', 'Desert Adventures'],
  ['city-tours', 'City Tours'],
  ['attractions', 'Attractions'],
  ['cruises', 'Cruises'],
  ['water-activities', 'Water Activities'],
  ['aerial-experiences', 'Aerial Experiences'],
  ['packages', 'Dubai Packages Tour'],
]

const PLACEMENT_CAMPAIGNS = [
  ['/tours/desert-safari', 'Desert Safari'],
  ['/tours/evening-desert-safari', 'Evening Desert Safari'],
  ['/tours/quad-bike', 'Quad Bike'],
  ['/tours/dune-buggy', 'Dune Buggy'],
  ['/tours/private-desert-setup', 'Private Desert Setup'],
  ['/tours/desert-safari/private-desert-safari-packages', 'Private Desert Safari Family Packages'],
]

function PlacementEditor({ value, onChange }) {
  const current = {
    home: false,
    services: false,
    categoryPages: [],
    campaignPages: [],
    specificUrls: [],
    ...(value || {}),
  }

  const toggleArray = (key, item) => {
    const list = Array.isArray(current[key]) ? current[key] : []
    const next = list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item]
    onChange({ ...current, [key]: next })
  }

  return (
    <section className="admin-placement-editor">
      <div className="admin-section-label">Where should this tour card appear?</div>
      <p className="admin-placement-help">
        All published tours remain available on the All Tours page. Select the extra locations where you also want this card to appear.
      </p>

      <div className="admin-placement-checks">
        <label className="admin-placement-option admin-placement-option--wide">
          <input type="checkbox" checked={Boolean(current.home)} onChange={(event) => onChange({ ...current, home: event.target.checked })} />
          <span><strong>Home page</strong><small>Show in Top Experiences.</small></span>
        </label>

        <label className="admin-placement-option admin-placement-option--wide is-readonly">
          <input type="checkbox" checked readOnly disabled />
          <span><strong>All Tours page</strong><small>Always shown for published tours.</small></span>
        </label>

        <label className="admin-placement-option admin-placement-option--wide">
          <input type="checkbox" checked={Boolean(current.services)} onChange={(event) => onChange({ ...current, services: event.target.checked })} />
          <span><strong>Services page</strong><small>Append to the existing service cards.</small></span>
        </label>
      </div>

      <div className="admin-placement-block">
        <strong>Category pages</strong>
        <small>Choose any additional category page. The tour's own category page remains automatic.</small>
        <div className="admin-placement-grid">
          {PLACEMENT_CATEGORIES.map(([value, label]) => (
            <label className="admin-placement-option" key={value}>
              <input type="checkbox" checked={current.categoryPages.includes(value)} onChange={() => toggleArray('categoryPages', value)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="admin-placement-block">
        <strong>Campaign / landing pages</strong>
        <small>Example: select Dune Buggy to show the card on /tours/dune-buggy/.</small>
        <div className="admin-placement-grid">
          {PLACEMENT_CAMPAIGNS.map(([value, label]) => (
            <label className="admin-placement-option" key={value}>
              <input type="checkbox" checked={current.campaignPages.includes(value)} onChange={() => toggleArray('campaignPages', value)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="admin-placement-block">
        <strong>Specific URL(s)</strong>
        <small>One same-site path per line. Example: /tours/dune-buggy/</small>
        <textarea
          className="admin-input admin-textarea admin-placement-urls"
          rows={4}
          value={current.specificUrls.join('\\n')}
          onChange={(event) => onChange({
            ...current,
            specificUrls: event.target.value.split(/\\r?\\n/).map((item) => item.trim()).filter(Boolean)
          })}
          placeholder="/tours/dune-buggy/&#10;/tours/city-tours/"
        />
      </div>
    </section>
  )
}

function FaqEditor({ faqs, onChange }) {`,
  'PlacementEditor component',
)

replaceOnce(
  files.adminApp,
  `  const [form, setForm] = useState({ ...EMPTY_TOUR, ...initial })`,
  `  const [form, setForm] = useState(() => {
    const merged = { ...EMPTY_TOUR, ...initial }
    const incomingPlacements = initial?.placements || {}
    return {
      ...merged,
      placements: {
        ...EMPTY_TOUR.placements,
        ...incomingPlacements,
        home: incomingPlacements.home ?? Boolean(initial?.featured),
      },
    }
  })`,
  'TourForm placement state',
)

replaceOnce(
  files.adminApp,
  `body: JSON.stringify({ ...form, slug: form.slug || slugify(form.title) })`,
  `body: JSON.stringify({
        ...form,
        slug: form.slug || slugify(form.title),
        featured: Boolean(form.placements?.home),
      })`,
  'TourForm save placement sync',
)

replaceOnce(
  files.adminApp,
  `<FaqEditor faqs={form.faqs} onChange={(value) => update('faqs', value)} />
      <div className="admin-toggle-row"><label><input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} /> Featured</label><label><input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} /> Published</label></div>`,
  `<PlacementEditor value={form.placements} onChange={(value) => update('placements', value)} />
      <FaqEditor faqs={form.faqs} onChange={(value) => update('faqs', value)} />
      <div className="admin-toggle-row"><label><input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} /> Published</label></div>`,
  'TourForm placement UI',
)

replaceOnce(
  files.adminApp,
  `<img src={item.image} alt="" />`,
  `<img src={adminMediaUrl(item.image)} alt="" />`,
  'admin tour list image',
)

/* -----------------------------------------------------------------------
   5) Public placement rendering.
------------------------------------------------------------------------ */
replaceOnce(
  files.campaignLanding,
  `function CampaignPackageCard({ tour, campaignTitle }) {
  const href = tour.href || getTourDetailHref(tour.category, tour.sourceTitle || tour.title)`,
  `function CampaignPackageCard({ tour, campaignTitle }) {
  const href = tour.href || (tour.slug && tour.categorySlug
    ? \`/tours/\${tour.categorySlug}/\${tour.slug}\`
    : getTourDetailHref(tour.category, tour.sourceTitle || tour.title))`,
  'campaign dynamic detail URL',
)

replaceOnce(
  files.campaignLanding,
  `<img src={tour.image} alt={tour.title} loading="lazy" />`,
  `<img src={mediaUrl(tour.image)} alt={tour.title} loading="lazy" />`,
  'campaign card image',
)
replaceOnce(
  files.campaignLanding,
  `import { apiUrl } from '../../utils/apiBaseUrl'`,
  `import { apiUrl, mediaUrl } from '../../utils/apiBaseUrl'`,
  'campaign media import',
)

replaceOnce(
  files.campaignLanding,
  `export default function CampaignLanding({ slug, menuOpen, setMenuOpen }) {
  const pageRef = useRef(null)
  const page = getCampaignPage(slug)
  useLuxuryReveal(pageRef)`,
  `export default function CampaignLanding({ slug, menuOpen, setMenuOpen }) {
  const pageRef = useRef(null)
  const page = getCampaignPage(slug)
  const currentPath = typeof window !== 'undefined' ? (window.location.pathname.replace(/\\/+$/, '') || '/') : '/'
  const [dynamicTours, setDynamicTours] = useState([])
  useLuxuryReveal(pageRef)

  useEffect(() => {
    if (!page) return undefined
    let active = true
    fetch(apiUrl('/api/tours'))
      .then((response) => response.ok ? response.json() : [])
      .then((items) => {
        if (!active) return
        setDynamicTours(Array.isArray(items) ? items.filter((item) => {
          const placements = item?.placements || {}
          return placements.campaignPages?.includes(currentPath) || placements.specificUrls?.includes(currentPath)
        }) : [])
      })
      .catch(() => {})
    return () => { active = false }
  }, [page, currentPath])

  const displayPage = page ? {
    ...page,
    tours: [
      ...page.tours,
      ...dynamicTours.filter((dynamicTour) => !page.tours.some((tour) =>
        String(tour.title || '').trim().toLowerCase() === String(dynamicTour.title || '').trim().toLowerCase()
      )),
    ],
  } : page`,
  'CampaignLanding dynamic placement state',
)

replaceOnce(
  files.campaignLanding,
  "<div className=\"category-tour-grid ${page.tours.length === 3 ? 'category-tour-grid--three' : ''}>\n            {page.tours.map((tour) => <CampaignPackageCard key={tour.id} tour={tour} campaignTitle={page.title} />)}",
  "<div className={\`category-tour-grid \${displayPage.tours.length === 3 ? 'category-tour-grid--three' : ''}\`}>\n            {displayPage.tours.map((tour) => <CampaignPackageCard key={tour.id || tour.slug || tour.title} tour={tour} campaignTitle={page.title} />)}",
  'CampaignLanding dynamic package grid',
)

replaceOnce(
  files.campaignLanding,
  `<BookingForm page={page} />`,
  `<BookingForm page={displayPage} />`,
  'CampaignLanding booking form dynamic packages',
)

replaceOnce(
  files.tourCategory,
  `import { useEffect, useRef } from 'react'`,
  `import { useEffect, useRef, useState } from 'react'`,
  'TourCategory state import',
)
replaceOnce(
  files.tourCategory,
  `import { getCardPoints } from '../../utils/cardContent'`,
  `import { getCardPoints } from '../../utils/cardContent'
import { mediaUrl } from '../../utils/apiBaseUrl'`,
  'TourCategory media import',
)
replaceOnce(
  files.tourCategory,
  `const detailHref = getTourDetailHref(category, tour.title)`,
  `const detailHref = tour.href || (tour.slug && tour.categorySlug
    ? \`/tours/\${tour.categorySlug}/\${tour.slug}\`
    : getTourDetailHref(category, tour.title))`,
  'TourCategory dynamic detail URL',
)
replaceOnce(
  files.tourCategory,
  `<img src={tour.image} alt={tour.title} loading="lazy" />`,
  `<img src={mediaUrl(tour.image)} alt={tour.title} loading="lazy" />`,
  'TourCategory card image',
)
replaceOnce(
  files.tourCategory,
  `export default function TourCategory({ slug, menuOpen, setMenuOpen }) {
  const pageRef = useRef(null)
  const page = tourCategoryPages[slug]

  useLuxuryReveal(pageRef)`,
  `export default function TourCategory({ slug, menuOpen, setMenuOpen }) {
  const pageRef = useRef(null)
  const page = tourCategoryPages[slug]
  const currentPath = typeof window !== 'undefined' ? (window.location.pathname.replace(/\\/+$/, '') || '/') : '/'
  const [dynamicTours, setDynamicTours] = useState([])

  useLuxuryReveal(pageRef)

  useEffect(() => {
    if (!page) return undefined
    let active = true
    fetch(apiUrl('/api/tours'))
      .then((response) => response.ok ? response.json() : [])
      .then((items) => {
        if (!active) return
        setDynamicTours(Array.isArray(items) ? items.filter((item) => {
          const placements = item?.placements || {}
          return item?.categorySlug === slug ||
            placements.categoryPages?.includes(slug) ||
            placements.specificUrls?.includes(currentPath)
        }) : [])
      })
      .catch(() => {})
    return () => { active = false }
  }, [page, slug, currentPath])

  const displayedTours = page ? [
    ...page.tours,
    ...dynamicTours.filter((dynamicTour) => !page.tours.some((tour) =>
      String(tour.title || '').trim().toLowerCase() === String(dynamicTour.title || '').trim().toLowerCase()
    )),
  ] : []`,
  'TourCategory dynamic placement state',
)

replaceOnce(
  files.tourCategory,
  `import { getTourDetailHref } from '../../tourDetails'`,
  `import { getTourDetailHref } from '../../tourDetails'
import { apiUrl } from '../../utils/apiBaseUrl'`,
  'TourCategory API import',
)
replaceOnce(
  files.tourCategory,
  `{page.tours.map((tour) => <CategoryTourCard key={tour.id} tour={tour} page={page} />)}`,
  `{displayedTours.map((tour) => <CategoryTourCard key={tour.id || tour.slug || tour.title} tour={tour} page={page} />)}`,
  'TourCategory dynamic package grid',
)
replaceOnce(
  files.tourCategory,
  `className={\`category-tour-grid \${page.tours.length === 3 ? 'category-tour-grid--three' : ''}\`}`,
  `className={\`category-tour-grid \${displayedTours.length === 3 ? 'category-tour-grid--three' : ''}\`}`,
  'TourCategory grid count',
)

/* Services page: explicitly placed CMS tours append to existing services. */
replaceOnce(
  files.services,
  `import { memo, useEffect, useRef } from "react";`,
  `import { memo, useEffect, useRef, useState } from "react";`,
  'Services state import',
)
replaceOnce(
  files.services,
  `import { getCardPoints } from "../../utils/cardContent";`,
  `import { getCardPoints } from "../../utils/cardContent";
import { apiUrl, mediaUrl } from "../../utils/apiBaseUrl";`,
  'Services API/media import',
)
replaceOnce(
  files.services,
  `  const detailHref = getTourDetailHref(category, service.title);`,
  `  const detailHref = service.href || (service.slug && service.categorySlug
    ? \`/tours/\${service.categorySlug}/\${service.slug}\`
    : getTourDetailHref(category, service.title));`,
  'Services dynamic detail URL',
)
replaceOnce(
  files.services,
  `src={service.image}`,
  `src={mediaUrl(service.image)}`,
  'Services image source',
)
replaceOnce(
  files.services,
  `export default function Services({ menuOpen, setMenuOpen }) {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const cardsGridRef = useRef(null);

  useLuxuryReveal(pageRef);`,
  `export default function Services({ menuOpen, setMenuOpen }) {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const cardsGridRef = useRef(null);
  const [dynamicServices, setDynamicServices] = useState([]);

  useLuxuryReveal(pageRef);

  useEffect(() => {
    let active = true;
    fetch(apiUrl('/api/tours'))
      .then((response) => response.ok ? response.json() : [])
      .then((items) => {
        if (!active) return;
        setDynamicServices(Array.isArray(items) ? items.filter((item) => item?.placements?.services || item?.placements?.specificUrls?.includes('/services')).map((item) => ({
          ...item,
          icon: getServiceIcon(item),
        })) : []);
      })
      .catch(() => {});
    return () => { active = false };
  }, []);

  const displayedServices = [...services, ...dynamicServices.filter((item) =>
    !services.some((service) => String(service.title || '').trim().toLowerCase() === String(item.title || '').trim().toLowerCase())
  )];`,
  'Services dynamic placement state',
)
replaceOnce(
  files.services,
  `  }, []);

  const displayedServices = [...services, ...dynamicServices.filter((item) =>
    !services.some((service) => String(service.title || '').trim().toLowerCase() === String(item.title || '').trim().toLowerCase())
  )];`,
  `  }, [dynamicServices]);

  const displayedServices = [...services, ...dynamicServices.filter((item) =>
    !services.some((service) => String(service.title || '').trim().toLowerCase() === String(item.title || '').trim().toLowerCase())
  )];`,
  'Services observer dependency',
)
replaceOnce(
  files.services,
  `{services.map((service, index) => (`,
  `{displayedServices.map((service, index) => (`,
  'Services dynamic card grid',
)

/* Tour detail dynamic media. */
replaceOnce(
  files.tourDetail,
  `import { useLuxuryReveal } from '../../hooks/useLuxuryReveal'`,
  `import { useLuxuryReveal } from '../../hooks/useLuxuryReveal'
import { mediaUrl } from '../../utils/apiBaseUrl'`,
  'TourDetail media import',
)
replaceOnce(
  files.tourDetail,
  `src={gallery[activeImage]}`,
  `src={mediaUrl(gallery[activeImage])}`,
  'TourDetail hero image',
)
replaceOnce(
  files.tourDetail,
  `src={image} alt=""`,
  `src={mediaUrl(image)} alt=""`,
  'TourDetail thumbnail image',
)

/* Blog home dynamic images also use the same server upload format. */
replaceOnce(
  files.blogSection,
  `import { apiUrl } from '../../utils/apiBaseUrl'`,
  `import { apiUrl, mediaUrl } from '../../utils/apiBaseUrl'`,
  'BlogSection media import',
)
replaceOnce(
  files.blogSection,
  `src={blog.homeImage || blog.listImage}`,
  `src={mediaUrl(blog.homeImage || blog.listImage)}`,
  'BlogSection image normalization',
)

/* -----------------------------------------------------------------------
   6) Admin placement CSS. No existing visual redesign; only new controls.
------------------------------------------------------------------------ */
fs.appendFileSync(files.adminCss, `

/* =========================================================
   CMS PLACEMENT + MULTILINE TOUR FIELDS
   Added without changing the existing public-site design.
========================================================= */
.admin-list-textarea {
  width: 100%;
  min-height: 112px;
  resize: vertical;
  line-height: 1.55;
  padding: 12px 13px;
}

.admin-placement-editor {
  margin-top: 24px;
  padding: 22px;
  border: 1px solid rgba(17, 27, 43, .09);
  border-radius: 14px;
  background: #fbfaf7;
}

.admin-placement-help {
  margin: -4px 0 18px;
  color: #707783;
  font-size: 13px;
  line-height: 1.55;
}

.admin-placement-checks,
.admin-placement-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.admin-placement-checks {
  margin-bottom: 18px;
}

.admin-placement-option {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  padding: 11px 12px;
  border: 1px solid rgba(17, 27, 43, .08);
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
}

.admin-placement-option input {
  flex: 0 0 auto;
  margin-top: 3px;
  accent-color: #c98a2e;
}

.admin-placement-option span {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
  color: #1b2636;
  font-size: 13px;
  line-height: 1.35;
}

.admin-placement-option small {
  color: #777f89;
  font-size: 11px;
}

.admin-placement-option--wide {
  min-height: 58px;
}

.admin-placement-option.is-readonly {
  opacity: .72;
  cursor: default;
}

.admin-placement-block {
  margin-top: 18px;
}

.admin-placement-block > strong {
  display: block;
  margin-bottom: 4px;
  color: #1b2636;
  font-size: 13px;
}

.admin-placement-block > small {
  display: block;
  margin-bottom: 10px;
  color: #777f89;
  font-size: 11px;
  line-height: 1.45;
}

.admin-placement-urls {
  min-height: 96px;
  resize: vertical;
}

@media (max-width: 760px) {
  .admin-placement-checks,
  .admin-placement-grid {
    grid-template-columns: 1fr;
  }

  .admin-placement-editor {
    padding: 16px;
  }
}
`)

console.log(`[Tripscape patch] Updated project: ${root}`)
console.log(`[Tripscape patch] Backup created: ${backupRoot}`)
console.log('\nChanges:')
console.log('  1. Admin auth uses a browser-session cookie; /me upgrades old persistent cookies.')
console.log('  2. Tour CMS gets placement controls: Home, Services, category pages, campaign pages, and specific URL(s).')
console.log('  3. All published tours remain on All Tours; matching category remains automatic.')
console.log('  4. Homepage selected CMS tours append without removing the existing Top Experiences cards.')
console.log('  5. Upload accepts image/* plus common AVIF/APNG/BMP/TIFF/ICO/SVG/HEIC/HEIF/JXL MIME types.')
console.log('  6. Uploaded media URLs are normalized through apiUrl(), fixing /api/uploads on Vercel.')
console.log('  7. Inclusions/exclusions are multiline textareas and accept up to 3000 characters per item.')
console.log('\nNext: run the normal client build and deploy the backend + frontend together.')
