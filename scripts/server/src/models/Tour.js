import mongoose from 'mongoose'

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  destination: { type: String, default: 'Dubai' },
  image: String,
  price: String,
  duration: String,
  featured: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('Tour', tourSchema)
