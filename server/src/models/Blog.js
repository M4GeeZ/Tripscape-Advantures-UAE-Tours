import mongoose from 'mongoose'

const faqSchema = new mongoose.Schema({
  question: { type: String, trim: true, maxlength: 300 },
  answer: { type: String, trim: true, maxlength: 3000 },
}, { _id: false })

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 220 },
  slug: { type: String, required: true, unique: true, index: true },
  category: { type: String, default: 'Guides', trim: true },
  image: { type: String, default: '' },
  excerpt: { type: String, default: '', maxlength: 600 },
  content: { type: String, default: '' },
  author: { type: String, default: 'Tripscape Team', maxlength: 120 },
  publishedAt: { type: Date, default: Date.now },
  readingTime: { type: String, default: '5 min read', maxlength: 40 },
  published: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  seoTitle: { type: String, default: '', maxlength: 180 },
  metaDescription: { type: String, default: '', maxlength: 320 },
  canonical: { type: String, default: '' },
  faqs: { type: [faqSchema], default: [] },
}, { timestamps: true })

blogSchema.index({ published: 1, featured: -1, publishedAt: -1 })

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema)
