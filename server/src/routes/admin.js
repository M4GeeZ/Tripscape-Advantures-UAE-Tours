import { Router } from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import mongoose from 'mongoose'
import Tour from '../models/Tour.js'
import Blog from '../models/Blog.js'
import Review from '../models/Review.js'
import { requireAdmin } from '../utils/security.js'
import { slugify } from '../utils/slugify.js'
import { sanitizeHtml } from '../utils/sanitizeHtml.js'
import SeoPage from '../models/SeoPage.js'
import { validateSchemaFields } from '../utils/schemaValidation.js'
import { normalizeSeoPath } from '../utils/seoPath.js'

const router = Router()
const __filename = fileURLToPath(import.meta.url)
const serverRoot = path.resolve(__filename, '../../..')
router.use(requireAdmin)

const categories = ['Desert Safari', 'Desert Adventures', 'City Tours', 'Attractions', 'Cruises', 'Water Activities', 'Aerial Experiences', 'Dubai Packages Tour', 'Quad Bike', 'Dune Buggy', 'Private Desert Setup', 'Private Tours']
const destinations = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah', 'Fujairah', 'Ajman', 'Umm Al Quwain', 'UAE']

function ensureDb(res) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'MongoDB is not connected. Add a valid MONGO_URI on the server.' })
    return false
  }
  return true
}

function cleanString(value, max = 50000) {
  return String(value ?? '').trim().slice(0, max)
}

function cleanList(value, maxItems = 30, maxLength = 500) {
  if (!Array.isArray(value)) return []
  return value.map((item) => cleanString(item, maxLength)).filter(Boolean).slice(0, maxItems)
}

function cleanFaqs(value) {
  if (!Array.isArray(value)) return []
  return value.map((faq) => ({
    question: cleanString(faq?.question, 300),
    answer: cleanString(faq?.answer, 3000),
  })).filter((faq) => faq.question && faq.answer).slice(0, 20)
}

async function uniqueSlug(Model, requested, id = null) {
  const base = slugify(requested) || `item-${Date.now()}`
  let candidate = base
  let index = 2
  while (true) {
    const query = id ? { slug: candidate, _id: { $ne: id } } : { slug: candidate }
    const exists = await Model.exists(query)
    if (!exists) return candidate
    candidate = `${base}-${index++}`
  }
}

function mediaUrl(value) {
  const source = String(value || '')
  if (source.startsWith('/uploads/')) return `/api${source}`
  return source
}

function mediaSafeUrl(value) {
  const source = cleanString(value, 1000)
  if (!source) return ''
  try {
    const parsed = new URL(source)
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : ''
  } catch {
    return ''
  }
}

function cleanReviewDate(value, fallback = new Date()) {
  if (!value) return fallback
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? fallback : date
}

function mapReview(review) {
  return {
    id: `db-${review._id}`,
    _id: review._id,
    name: review.name,
    rating: Number(review.rating) || 5,
    text: review.text,
    source: review.source || 'Website',
    sourceUrl: review.sourceUrl || '',
    reviewDate: review.reviewDate || review.createdAt,
    published: Boolean(review.published),
    sortOrder: Number(review.sortOrder) || 0,
  }
}

function normalizeContentImages(value) {
  return String(value || '').replace(/(src|href)=(["'])\/uploads\//g, '$1=$2/api/uploads/')
}

function mapTour(tour) {
  return {
    id: `db-${tour._id}`,
    _id: tour._id,
    title: tour.title,
    slug: tour.slug,
    category: tour.category,
    destination: tour.destination,
    location: `${tour.destination}, UAE`,
    image: mediaUrl(tour.image),
    gallery: Array.isArray(tour.gallery) ? tour.gallery.map(mediaUrl) : [],
    shortDescription: tour.shortDescription,
    description: tour.description,
    price: tour.price || 'Contact for price',
    unit: tour.unit,
    duration: tour.duration,
    rating: tour.rating,
    reviews: tour.reviews,
    included: tour.included,
    excluded: tour.excluded,
    faqs: tour.faqs,
    featured: tour.featured,
    published: tour.published,
    categoryLabel: tour.category,
    categorySlug: slugify(tour.category),
    seoTitle: tour.seoTitle,
    metaDescription: tour.metaDescription,
    canonical: tour.canonical,
    schemaMode: tour.schemaMode || 'auto',
    schemaJsonLd: tour.schemaJsonLd || '',
    robots: tour.robots || 'index,follow',
    focusKeyword: tour.focusKeyword || '',
    sortOrder: tour.sortOrder,
  }
}

function mapBlog(blog) {
  return {
    id: `db-${blog._id}`,
    _id: blog._id,
    slug: blog.slug,
    title: blog.title,
    category: blog.category,
    listImage: mediaUrl(blog.image),
    homeImage: mediaUrl(blog.image),
    image: mediaUrl(blog.image),
    copy: blog.excerpt,
    description: blog.excerpt,
    content: normalizeContentImages(blog.content),
    author: blog.author,
    date: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    publishedAt: blog.publishedAt,
    time: blog.readingTime,
    published: blog.published,
    featured: blog.featured,
    seoTitle: blog.seoTitle,
    metaDescription: blog.metaDescription,
    canonical: blog.canonical,
    schemaMode: blog.schemaMode || 'auto',
    schemaJsonLd: blog.schemaJsonLd || '',
    robots: blog.robots || 'index,follow',
    focusKeyword: blog.focusKeyword || '',
    faqs: blog.faqs,
  }
}

router.get('/stats', async (_req, res) => {
  if (!ensureDb(res)) return
  const [tours, publishedTours, blogs, publishedBlogs, reviews, publishedReviews] = await Promise.all([
    Tour.countDocuments(),
    Tour.countDocuments({ published: true }),
    Blog.countDocuments(),
    Blog.countDocuments({ published: true }),
    Review.countDocuments(),
    Review.countDocuments({ published: true }),
  ])
  res.json({ tours, publishedTours, blogs, publishedBlogs, reviews, publishedReviews })
})

router.get('/tours', async (req, res) => {
  if (!ensureDb(res)) return
  const query = {}
  if (req.query.published === 'true') query.published = true
  if (req.query.published === 'false') query.published = false
  const tours = await Tour.find(query).sort({ sortOrder: 1, createdAt: 1 }).lean()
  res.json(tours.map(mapTour))
})

router.post('/tours', async (req, res) => {
  if (!ensureDb(res)) return
  const body = req.body || {}
  const schemaFields = validateSchemaFields(body)
  if (schemaFields.error) return res.status(400).json({ message: schemaFields.error })
  if (!cleanString(body.title, 180)) return res.status(400).json({ message: 'Tour title is required.' })
  const slug = await uniqueSlug(Tour, body.slug || body.title)
  const firstTour = await Tour.findOne().sort({ sortOrder: 1 }).select('sortOrder').lean()
  const firstSortOrder = Number(firstTour?.sortOrder)
  const nextSortOrder = Number.isFinite(firstSortOrder) ? firstSortOrder - 1 : 0
  const tour = await Tour.create({
    title: cleanString(body.title, 180), slug,
    category: categories.includes(body.category) ? body.category : 'Desert Safari',
    destination: destinations.includes(body.destination) ? body.destination : 'Dubai',
    image: cleanString(body.image, 1000), gallery: cleanList(body.gallery, 10, 1000),
    shortDescription: cleanString(body.shortDescription, 500), description: cleanString(body.description, 12000),
    price: cleanString(body.price, 100) || 'Contact for price', unit: cleanString(body.unit, 100), duration: cleanString(body.duration, 120) || 'Tour experience',
    rating: cleanString(body.rating, 20) || '4.9', reviews: Math.max(0, Number(body.reviews) || 0),
    included: cleanList(body.included), excluded: cleanList(body.excluded), faqs: cleanFaqs(body.faqs),
    featured: Boolean(body.featured), published: body.published !== false,
    seoTitle: cleanString(body.seoTitle, 180), metaDescription: cleanString(body.metaDescription, 320), canonical: cleanString(body.canonical, 1000),
    ...schemaFields.value,
    sortOrder: nextSortOrder,
  })
  res.status(201).json(mapTour(tour))
})

router.put('/tours/:id', async (req, res) => {
  if (!ensureDb(res)) return
  const body = req.body || {}
  const schemaFields = validateSchemaFields(body)
  if (schemaFields.error) return res.status(400).json({ message: schemaFields.error })
  const current = await Tour.findById(req.params.id)
  if (!current) return res.status(404).json({ message: 'Tour not found.' })
  if (!cleanString(body.title, 180)) return res.status(400).json({ message: 'Tour title is required.' })
  const slug = await uniqueSlug(Tour, body.slug || body.title, current._id)
  Object.assign(current, {
    title: cleanString(body.title, 180), slug,
    category: categories.includes(body.category) ? body.category : current.category,
    destination: destinations.includes(body.destination) ? body.destination : current.destination,
    image: cleanString(body.image, 1000), gallery: cleanList(body.gallery, 10, 1000),
    shortDescription: cleanString(body.shortDescription, 500), description: cleanString(body.description, 12000),
    price: cleanString(body.price, 100) || 'Contact for price', unit: cleanString(body.unit, 100), duration: cleanString(body.duration, 120) || 'Tour experience',
    rating: cleanString(body.rating, 20) || '4.9', reviews: Math.max(0, Number(body.reviews) || 0),
    included: cleanList(body.included), excluded: cleanList(body.excluded), faqs: cleanFaqs(body.faqs),
    featured: Boolean(body.featured), published: body.published !== false,
    seoTitle: cleanString(body.seoTitle, 180), metaDescription: cleanString(body.metaDescription, 320), canonical: cleanString(body.canonical, 1000),
    ...schemaFields.value,
  })
  await current.save()
  res.json(mapTour(current))
})

router.delete('/tours/:id', async (req, res) => {
  if (!ensureDb(res)) return
  const deleted = await Tour.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ message: 'Tour not found.' })
  res.json({ deleted: true })
})

router.get('/blogs', async (_req, res) => {
  if (!ensureDb(res)) return
  const blogs = await Blog.find().sort({ featured: -1, publishedAt: -1, createdAt: -1 }).lean()
  res.json(blogs.map(mapBlog))
})

router.post('/blogs', async (req, res) => {
  if (!ensureDb(res)) return
  const body = req.body || {}
  const schemaFields = validateSchemaFields(body)
  if (schemaFields.error) return res.status(400).json({ message: schemaFields.error })
  if (!cleanString(body.title, 220)) return res.status(400).json({ message: 'Article title is required.' })
  const slug = await uniqueSlug(Blog, body.slug || body.title)
  const blog = await Blog.create({
    title: cleanString(body.title, 220), slug,
    category: cleanString(body.category, 80) || 'Guides', image: cleanString(body.image, 1000),
    excerpt: cleanString(body.excerpt, 600), content: sanitizeHtml(body.content || ''),
    author: cleanString(body.author, 120) || 'Tripscape Team',
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(), readingTime: cleanString(body.readingTime, 40) || '5 min read',
    published: body.published !== false, featured: Boolean(body.featured),
    seoTitle: cleanString(body.seoTitle, 180), metaDescription: cleanString(body.metaDescription, 320), canonical: cleanString(body.canonical, 1000),
    faqs: cleanFaqs(body.faqs),
    ...schemaFields.value,
  })
  res.status(201).json(mapBlog(blog))
})

router.put('/blogs/:id', async (req, res) => {
  if (!ensureDb(res)) return
  const body = req.body || {}
  const schemaFields = validateSchemaFields(body)
  if (schemaFields.error) return res.status(400).json({ message: schemaFields.error })
  const current = await Blog.findById(req.params.id)
  if (!current) return res.status(404).json({ message: 'Article not found.' })
  if (!cleanString(body.title, 220)) return res.status(400).json({ message: 'Article title is required.' })
  const slug = await uniqueSlug(Blog, body.slug || body.title, current._id)
  Object.assign(current, {
    title: cleanString(body.title, 220), slug, category: cleanString(body.category, 80) || 'Guides', image: cleanString(body.image, 1000),
    excerpt: cleanString(body.excerpt, 600), content: sanitizeHtml(body.content || ''), author: cleanString(body.author, 120) || 'Tripscape Team',
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : current.publishedAt, readingTime: cleanString(body.readingTime, 40) || '5 min read',
    published: body.published !== false, featured: Boolean(body.featured), seoTitle: cleanString(body.seoTitle, 180),
    metaDescription: cleanString(body.metaDescription, 320), canonical: cleanString(body.canonical, 1000), faqs: cleanFaqs(body.faqs),
    ...schemaFields.value,
  })
  await current.save()
  res.json(mapBlog(current))
})

router.delete('/blogs/:id', async (req, res) => {
  if (!ensureDb(res)) return
  const deleted = await Blog.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ message: 'Article not found.' })
  res.json({ deleted: true })
})

router.get('/reviews', async (_req, res) => {
  if (!ensureDb(res)) return
  const reviews = await Review.find().sort({ sortOrder: 1, reviewDate: -1, createdAt: -1 }).lean()
  res.json(reviews.map(mapReview))
})

router.post('/reviews', async (req, res) => {
  if (!ensureDb(res)) return
  const body = req.body || {}
  const name = cleanString(body.name, 120)
  const text = cleanString(body.text, 2000)
  const rating = Math.round(Number(body.rating))

  if (!name) return res.status(400).json({ message: 'Reviewer name is required.' })
  if (!text) return res.status(400).json({ message: 'Review text is required.' })
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5.' })

  const review = await Review.create({
    name,
    rating,
    text,
    source: cleanString(body.source, 40) || 'Website',
    sourceUrl: mediaSafeUrl(body.sourceUrl),
    reviewDate: cleanReviewDate(body.reviewDate),
    published: body.published !== false,
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
  })

  res.status(201).json(mapReview(review))
})

router.put('/reviews/:id', async (req, res) => {
  if (!ensureDb(res)) return
  const body = req.body || {}
  const current = await Review.findById(req.params.id)
  if (!current) return res.status(404).json({ message: 'Review not found.' })

  const name = cleanString(body.name, 120)
  const text = cleanString(body.text, 2000)
  const rating = Math.round(Number(body.rating))
  if (!name) return res.status(400).json({ message: 'Reviewer name is required.' })
  if (!text) return res.status(400).json({ message: 'Review text is required.' })
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5.' })

  Object.assign(current, {
    name,
    rating,
    text,
    source: cleanString(body.source, 40) || 'Website',
    sourceUrl: mediaSafeUrl(body.sourceUrl),
    reviewDate: cleanReviewDate(body.reviewDate, current.reviewDate),
    published: body.published !== false,
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
  })
  await current.save()
  res.json(mapReview(current))
})

router.delete('/reviews/:id', async (req, res) => {
  if (!ensureDb(res)) return
  const deleted = await Review.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ message: 'Review not found.' })
  res.json({ deleted: true })
})

router.post('/upload', async (req, res) => {
  const dataUrl = cleanString(req.body?.data, 12 * 1024 * 1024)
  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/i)
  if (!match) return res.status(400).json({ message: 'Only JPG, PNG, WEBP or GIF images are allowed.' })
  const buffer = Buffer.from(match[2], 'base64')
  if (!buffer.length || buffer.length > 8 * 1024 * 1024) return res.status(413).json({ message: 'Image must be smaller than 8 MB.' })
  const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[match[1].toLowerCase()]
  const uploadsDir = path.join(serverRoot, 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })
  const filename = `${crypto.randomUUID()}.${extension}`
  await fs.writeFile(path.join(uploadsDir, filename), buffer, { flag: 'wx', mode: 0o640 })
  res.status(201).json({ url: `/api/uploads/${filename}` })
})

router.get('/meta', (_req, res) => res.json({ categories, destinations, blogCategories: ['Tips', 'Guides', 'Reviews', 'News', 'Destinations'] }))


// SEO PAGE OVERRIDES: any existing public URL can have CMS-managed metadata/schema.
router.get('/seo-pages', async (_req, res) => {
  if (!ensureDb(res)) return
  const pages = await SeoPage.find().sort({ path: 1 }).lean()
  res.json(pages)
})
router.post('/seo-pages', async (req, res) => {
  if (!ensureDb(res)) return
  const path = normalizeSeoPath(req.body?.path)
  if (!path || path.startsWith('/admin-panel-')) return res.status(400).json({ message: 'Enter a valid website URL path.' })
  const structured = validateSchemaFields(req.body || {})
  if (structured.error) return res.status(400).json({ message: structured.error })
  const body = req.body || {}
  const data = {
    path,
    seoTitle: cleanString(body.seoTitle, 180),
    metaDescription: cleanString(body.metaDescription, 320),
    canonical: cleanString(body.canonical, 1000),
    ...structured.value,
    published: body.published !== false,
  }
  const page = await SeoPage.findOneAndUpdate({ path }, { $set: data }, { upsert: true, new: true, runValidators: true })
  res.json(page)
})
router.delete('/seo-pages/:id', async (req, res) => {
  if (!ensureDb(res)) return
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid page ID.' })
  const removed = await SeoPage.findByIdAndDelete(req.params.id)
  if (!removed) return res.status(404).json({ message: 'SEO page not found.' })
  res.json({ deleted: true })
})

export default router
