import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['fresher', 'experienced', 'creative', 'modern', 'executive'],
    required: true
  },
  type: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  price: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  previewImage: {
    type: String,
    default: ''
  },
  features: [{
    type: String
  }],
  styles: {
    primaryColor: { type: String, default: '#3b82f6' },
    secondaryColor: { type: String, default: '#1e40af' },
    fontFamily: { type: String, default: 'Inter' },
    layout: { type: String, default: 'modern' },
    spacing: { type: String, default: 'normal' }
  },
  structure: {
    sections: { type: [String], default: [] },
    maxPages: { type: Number, default: 1 },
    layout: { type: String, default: 'classic' }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  downloadCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

templateSchema.index({ category: 1 });
templateSchema.index({ type: 1 });

const Template = mongoose.model('Template', templateSchema);
export default Template;