import mongoose from 'mongoose'
const seoPageSchema = new mongoose.Schema({
  path: { type: String, required: true, unique: true, index: true, maxlength: 500 },
  seoTitle: { type: String, default: '', maxlength: 180 },
  metaDescription: { type: String, default: '', maxlength: 320 },
  canonical: { type: String, default: '', maxlength: 1000 },
  robots: { type: String, default: 'index,follow', maxlength: 120 },
  focusKeyword: { type: String, default: '', maxlength: 180 },
  schemaMode: { type: String, enum: ['auto','custom','disabled'], default: 'auto' },
  schemaJsonLd: { type: String, default: '', maxlength: 65000 },
  published: { type: Boolean, default: true },
}, { timestamps: true })
export default mongoose.models.SeoPage || mongoose.model('SeoPage', seoPageSchema)
