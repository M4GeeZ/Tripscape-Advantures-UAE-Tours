import { Router } from 'express'
import Blog from '../models/Blog.js'

const router = Router()

function mapBlog(blog) {
  return {
    id: `db-${blog._id}`,
    _id: blog._id,
    slug: blog.slug,
    title: blog.title,
    category: blog.category,
    listImage: blog.image,
    homeImage: blog.image,
    image: blog.image,
    copy: blog.excerpt,
    description: blog.excerpt,
    content: blog.content,
    author: blog.author,
    date: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    publishedAt: blog.publishedAt,
    time: blog.readingTime,
    published: blog.published,
    featured: blog.featured,
    seoTitle: blog.seoTitle,
    metaDescription: blog.metaDescription,
    canonical: blog.canonical,
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
