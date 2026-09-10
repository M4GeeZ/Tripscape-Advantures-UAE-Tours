import mongoose from 'mongoose'

const deliveryChannelSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'not_configured', 'not_requested'],
      default: 'pending',
    },
    attempts: { type: Number, default: 0 },
    lastAttemptAt: { type: Date, default: null },
    lastError: { type: String, default: '' },
  },
  { _id: false },
)

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ['received', 'contacted', 'confirmed', 'cancelled'],
      default: 'received',
      index: true,
    },
    source: { type: String, default: 'tripscapetourism.com' },
    tourTitle: { type: String, required: true },
    service: { type: String, required: true },
    addOns: { type: [String], default: [] },
    pickup: { type: String, default: '' },
    notes: { type: String, default: '' },
    price: { type: String, default: 'Contact for price' },
    travelDate: { type: String, required: true },
    name: { type: String, required: true },
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0, min: 0 },
    email: { type: String, required: true, lowercase: true, trim: true },
    countryCode: { type: String, required: true },
    phone: { type: String, required: true },
    phoneDigits: { type: String, required: true },
    hasWhatsApp: { type: Boolean, default: false },
    delivery: {
      companyEmail: { type: deliveryChannelSchema, default: () => ({ status: 'pending' }) },
      customerEmail: { type: deliveryChannelSchema, default: () => ({ status: 'pending' }) },
      customerWhatsApp: { type: deliveryChannelSchema, default: () => ({ status: 'not_requested' }) },
    },
    nextNotificationAttemptAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
)

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema)
