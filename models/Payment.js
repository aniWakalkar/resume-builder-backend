import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true  // Add index for faster user queries
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentId: {
    type: String,
    unique: true,
    sparse: true
  },
  orderId: {
    type: String,
    unique: true
  },
  signature: String,
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
    index: true  // Index for querying by status
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'stripe', 'qr_code']
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Create compound index for common queries
// This is NOT a duplicate because it's a compound index on two fields
paymentSchema.index({ userId: 1, createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;