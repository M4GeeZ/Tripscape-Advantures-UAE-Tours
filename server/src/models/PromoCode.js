import mongoose from 'mongoose'

// Single-use promo codes issued by the site's offer popup.
// issued   -> shown in a popup; expires quickly if nobody copies it
// claimed  -> copied by a visitor; valid for a week
// redeemed -> used on a booking; kept permanently (expiresAt cleared)
const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  tourTitle: { type: String, required: true },
  tourKey: { type: String, required: true, index: true },
  category: { type: String, default: '' },
  slug: { type: String, default: '' },
  categorySlug: { type: String, default: '' },
  image: { type: String, default: '' },
  percent: { type: Number, required: true, min: 1, max: 90 },
  basePrice: { type: Number, required: true, min: 1 },
  unit: { type: String, default: '' },
  status: { type: String, enum: ['issued', 'claimed', 'redeemed'], default: 'issued', index: true },
  claimedAt: { type: Date, default: null },
  redeemedAt: { type: Date, default: null },
  bookingReference: { type: String, default: '' },
  expiresAt: { type: Date, default: null },
}, { timestamps: true })

// MongoDB removes unredeemed codes once expiresAt passes. Redeemed codes have no expiry.
promoCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.PromoCode || mongoose.model('PromoCode', promoCodeSchema)
