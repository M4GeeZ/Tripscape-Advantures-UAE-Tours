import mongoose from 'mongoose'

const faqSchema = new mongoose.Schema({
  question: { type: String, trim: true, maxlength: 300 },
  answer: { type: String, trim: true, maxlength: 3000 },
}, { _id: false })

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 180 },
  slug: { type: String, required: false, unique: true, sparse: true, index: true },
  category: { type: String, required: true, trim: true },
  destination: { type: String, default: 'Dubai', trim: true },
  image: { type: String, default: '' },
  gallery: { type: [String], default: [] },
  shortDescription: { type: String, default: '', maxlength: 500 },
  description: { type: String, default: '', maxlength: 12000 },
  price: { type: String, default: 'Contact for price' },
  unit: { type: String, default: '' },
  duration: { type: String, default: 'Tour experience' },
  rating: { type: String, default: '4.9' },
  reviews: { type: Number, default: 0, min: 0 },
  included: { type: [String], default: [] },
  excluded: { type: [String], default: [] },
  faqs: { type: [faqSchema], default: [] },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  seoTitle: { type: String, default: '', maxlength: 180 },
  metaDescription: { type: String, default: '', maxlength: 320 },
  canonical: { type: String, default: '' },
  schemaMode: { type: String, enum: ['auto','custom','disabled'], default: 'auto' },
  schemaJsonLd: { type: String, default: '', maxlength: 65000 },
  robots: { type: String, default: 'index,follow', maxlength: 120 },
  focusKeyword: { type: String, default: '', maxlength: 180 },
  placements: {
    home: { type: Boolean, default: false },
    allTours: { type: Boolean, default: true },
    services: { type: Boolean, default: false },
    paths: { type: [String], default: [] },
  },
  sortOrder: { type: Number, default: 0, index: true },
}, { timestamps: true })

tourSchema.index({ published: 1, featured: -1, createdAt: -1 })
tourSchema.index({ category: 1, destination: 1 })

export default mongoose.models.Tour || mongoose.model('Tour', tourSchema)
