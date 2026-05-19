import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['free', 'premium'],
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  thumbnailUrl: String,
  previewUrl: String,
  styles: {
    primaryColor: { type: String, default: '#2c3e50' },
    fontFamily: { type: String, default: 'Arial' },
    layout: { type: String, enum: ['single-column', 'two-column'], default: 'single-column' },
    spacing: { type: String, enum: ['compact', 'normal', 'relaxed'], default: 'normal' }
  },
  features: [String],
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

const Template = mongoose.model('Template', templateSchema);
export default Template;