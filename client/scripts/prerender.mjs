import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const scriptsDir = path.dirname(__filename)
const clientRoot = path.resolve(scriptsDir, '..')
const distDir = path.join(clientRoot, 'dist')
const origin = 'https://tripscapetourism.com'

function setServerBrowserGlobals(route) {
  const url = new URL(route, origin)
  const location = {
    href: url.href,
    origin: url.origin,
    protocol: url.protocol,
    host: url.host,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash
  }

  globalThis.window = {
    location,
    innerHeight: 900,
    matchMedia: () => ({ matches: false, addListener() {}, removeListener() {} }),
    history: { replaceState() {}, pushState() {} },
    scrollTo() {},
    open() {},
    setTimeout,
    clearTimeout
  }

  globalThis.navigator = { userAgent: 'TripscapePrerender/1.0' }
  globalThis.self = globalThis.window

  globalThis.document = {
    title: '',
    body: { style: {} },
    head: { appendChild() {} },
    documentElement: { style: {} },
    addEventListener() {},
    removeEventListener() {},
    querySelector() { return null },
    getElementById() { return null },
    createElement() {
      return { style: {}, setAttribute() {}, appendChild() {}, remove() {} }
    }
  }
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function normalizeRoute(route) {
  if (!route || route === '/') return '/'
  return `/${route.replace(/^\/+|\/+$/g, '')}`
}

function routeToOutputFile(route) {
  if (route === '/') return path.join(distDir, 'index.html')
  return path.join(distDir, route.slice(1), 'index.html')
}

function addUnique(list, value) {
  if (value && !list.includes(value)) list.push(value)
}

function getSeo(route, data) {
  const { campaignPages, tourCategoryPages, tourDetailPages, blogArticles } = data

  if (route === '/') {
    return {
      title: 'Tripscape Adventures | UAE Tours, Desert Safaris & City Tours',
      description: 'Explore Dubai and the UAE with Tripscape Adventures. Discover desert safaris, city tours, attractions, cruises and adventure experiences.'
    }
  }

  if (route === '/tours') {
    return {
      title: 'UAE Tours & Experiences | Tripscape Adventures',
      description: 'Explore Dubai and UAE tours including desert safaris, city tours, attractions, cruises, water activities and aerial experiences.'
    }
  }

  const campaignMatch = route.match(/^\/tours\/([^/]+)$/)
  if (campaignMatch) {
    const slug = campaignMatch[1]
    const page = tourCategoryPages[slug]
    const campaign = page?.campaign || campaignPages[slug]
    if (campaign) {
      return {
        title: campaign.seoTitle || page?.heroTitle || page?.name || 'Tripscape Adventures',
        description: campaign.seoDescription || page?.heroCopy || page?.sectionCopy || ''
      }
    }
    if (page) {
      return {
        title: `${page.heroTitle || page.name} | Tripscape Adventures`,
        description: page.heroCopy || page.sectionCopy || ''
      }
    }
  }

  const campaignNested = route.match(/^\/tours\/desert-safari\/([^/]+)$/)
  if (campaignNested && campaignPages[campaignNested[1]]) {
    const campaign = campaignPages[campaignNested[1]]
    return { title: campaign.seoTitle || campaign.title, description: campaign.seoDescription || campaign.heroCopy || '' }
  }

  const detailMatch = route.match(/^\/tours\/([^/]+)\/([^/]+)$/)
  if (detailMatch) {
    const detail = tourDetailPages.find(
      (item) => item.categorySlug === detailMatch[1] && item.slug === detailMatch[2]
    )
    if (detail) {
      return {
        title: `${detail.title} | Tripscape Adventures`,
        description: detail.description || `Explore ${detail.title} in Dubai and the UAE with Tripscape Adventures.`
      }
    }
  }

  const blogMatch = route.match(/^\/blog\/([^/]+)$/)
  if (blogMatch) {
    const article = blogArticles.find((item) => item.slug === blogMatch[1])
    if (article) return { title: `${article.title} | Tripscape Adventures`, description: article.description || article.copy || '' }
  }

  const staticSeo = {
    '/services': ['Dubai Tours & Travel Services | Tripscape Adventures', 'Explore desert safaris, city tours, attractions, cruises and adventure services across Dubai and the UAE.'],
    '/about': ['About Tripscape Adventures | UAE Tour Operator', 'Learn about Tripscape Adventures and our Dubai-based travel experiences, tours and adventure services.'],
    '/blog': ['Dubai Travel Blog | UAE Travel Guides & Tips', 'Read practical Dubai and UAE travel guides, tour tips, attraction information and planning advice.'],
    '/contact': ['Contact Tripscape Adventures | Dubai Tours & Bookings', 'Contact Tripscape Adventures for Dubai tours, desert safaris, attractions, bookings and travel support.'],
    '/privacy-policy': ['Privacy Policy | Tripscape Adventures', 'Read the Tripscape Adventures Privacy Policy covering personal data collection, use, sharing, security and your privacy rights.']
  }

  const item = staticSeo[route]
  return item ? { title: item[0], description: item[1] } : { title: 'Tripscape Adventures', description: 'Premium UAE tours, desert safaris and city experiences.' }
}

function injectSeo(template, route, seo) {
  let html = template
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`)
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeHtml(seo.description)}" />`)

  const canonical = `${origin}${route === '/' ? '/' : `${route}/`}`
  if (/<link\s+rel=["']canonical["']/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonical}" />`)
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${canonical}" />\n</head>`)
  }
  return html
}

async function loadRoutes(vite) {
  const appSource = await fs.readFile(path.join(clientRoot, 'src/App.jsx'), 'utf8')
  const [{ tourCategoryPages }, { tourDetailPages }, { blogArticles }, { campaignPages }] = await Promise.all([
    vite.ssrLoadModule('/src/tourCategoryPages.js'),
    vite.ssrLoadModule('/src/tourDetails.js'),
    vite.ssrLoadModule('/src/blogArticles.js'),
    vite.ssrLoadModule('/src/campaignPages.js')
  ])

  const routes = ['/','/tours','/services','/about','/blog','/contact']
  const campaignSlugs = Object.keys(campaignPages)
  for (const slug of campaignSlugs) addUnique(routes, `/tours/${slug}`)
  addUnique(routes, '/tours/desert-safari')
  addUnique(routes, '/tours/desert-safari/private-desert-safari-packages')
  addUnique(routes, '/tours/desert-adventures/desert-e-jet-water-go-kart-dubai')
  addUnique(routes, '/tours/desert-safari/vip-private-desert-safari-family-package')

  for (const slug of Object.keys(tourCategoryPages)) addUnique(routes, `/tours/${slug}`)
  for (const item of tourDetailPages) addUnique(routes, `/tours/${item.categorySlug}/${item.slug}`)
  for (const article of blogArticles) addUnique(routes, `/blog/${article.slug}`)

  if (/privacy-policy/i.test(appSource)) addUnique(routes, '/privacy-policy')

  return { routes: routes.map(normalizeRoute), tourCategoryPages, tourDetailPages, blogArticles, campaignPages }
}

async function main() {
  const vite = await createServer({
    root: clientRoot,
    appType: 'custom',
    logLevel: 'error',
    server: { middlewareMode: true },
    resolve: {
      alias: [
        {
          find: /[\\/]hooks[\\/]useSmoothScroll\.js$/,
          replacement: path.join(scriptsDir, 'ssr-noop', 'useSmoothScroll.mjs')
        },
        {
          find: /[\\/]hooks[\\/]useLuxuryReveal\.js$/,
          replacement: path.join(scriptsDir, 'ssr-noop', 'useLuxuryReveal.mjs')
        }
      ]
    }
  })

  try {
    const { default: App } = await vite.ssrLoadModule('/src/App.jsx')
    const data = await loadRoutes(vite)
    const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8')

    for (const route of data.routes) {
      setServerBrowserGlobals(route)
      const url = new URL(route, origin)
      const appHtml = renderToString(
        React.createElement(App, {
          initialPath: url.pathname,
          initialSearch: url.search
        })
      )

      const seo = getSeo(route, data)
      let pageHtml = injectSeo(template, route, seo)
      pageHtml = pageHtml.replace(
        '<div id="root"></div>',
        `<div id="root" data-prerendered="true">${appHtml}</div>`
      )

      const outputFile = routeToOutputFile(route)
      await fs.mkdir(path.dirname(outputFile), { recursive: true })
      await fs.writeFile(outputFile, pageHtml, 'utf8')
      console.log(`✓ prerendered ${route}`)
    }

    const sitemapUrls = data.routes.map((route) => `  <url><loc>${origin}${route === '/' ? '/' : `${route}/`}</loc></url>`).join('\n')
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`
    await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8')

    const robots = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
    await fs.writeFile(path.join(distDir, 'robots.txt'), robots, 'utf8')

    console.log(`\nPrerender complete: ${data.routes.length} routes.`)
  } finally {
    await vite.close()
  }
}

main().catch((error) => {
  console.error('\nPrerender failed:', error)
  process.exit(1)
})
