import { Router } from 'express'
import Blog from '../models/Blog.js'

const router = Router()

function mediaUrl(value) {
  const source = String(value || '')
  if (source.startsWith('/uploads/')) return `/api${source}`
  return source
}

function normalizeContentImages(value) {
  return String(value || '').replace(/(src|href)=(["'])\/uploads\//g, '$1=$2/api/uploads/')
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

router.get('/', async (_req, res) => {
  try {
    if (Blog.db.readyState !== 1) return res.json([])
    const blogs = await Blog.find({ published: true }).sort({ featured: -1, publishedAt: -1 }).lean()
    res.json(blogs.map(mapBlog))
  } catch {
    res.json([])
  }
})

router.get('/:slug', async (req, res) => {
  try {
    if (Blog.db.readyState !== 1) return res.status(404).json({ message: 'Article not found.' })
    const blog = await Blog.findOne({ slug: req.params.slug, published: true }).lean()
    if (!blog) return res.status(404).json({ message: 'Article not found.' })
    res.json(mapBlog(blog))
  } catch {
    res.status(404).json({ message: 'Article not found.' })
  }
})

export default router
