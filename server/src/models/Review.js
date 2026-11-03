import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true, trim: true, maxlength: 2000 },
  source: { type: String, default: 'Website', trim: true, maxlength: 40 },
  sourceUrl: { type: String, default: '', trim: true, maxlength: 1000 },
  reviewDate: { type: Date, default: Date.now },
  published: { type: Boolean, default: true, index: true },
  sortOrder: { type: Number, default: 0, index: true },
}, { timestamps: true })

reviewSchema.index({ published: 1, reviewDate: -1, createdAt: -1 })

export default mongoose.models.Review || mongoose.model('Review', reviewSchema)
