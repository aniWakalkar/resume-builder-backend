import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'Untitled Resume'
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  templateSlug: {
    type: String,
    default: ''
  },
  templateName: {
    type: String,
    default: ''
  },
  isPremiumTemplate: {
    type: Boolean,
    default: false
  },
  experienceType: {
    type: String,
    enum: ['fresher', 'experienced'],
    default: 'fresher'
  },
  personalInfo: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    profileSummary: { type: String, default: '' }
  },
  education: [{
    institution: { type: String, default: '' },
    degree: { type: String, default: '' },
    fieldOfStudy: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    current: { type: Boolean, default: false },
    grade: { type: String, default: '' },
    description: { type: String, default: '' }
  }],
  experience: [{
    company: { type: String, default: '' },
    position: { type: String, default: '' },
    location: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    current: { type: Boolean, default: false },
    description: { type: String, default: '' },
    achievements: [{ type: String }]
  }],
  skills: [{
    name: { type: String, default: '' },
    level: { type: String, default: 'Intermediate' },
    category: { type: String, default: 'Technical' }
  }],
  projects: [{
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    technologies: [{ type: String }],
    link: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' }
  }],
  certifications: [{
    name: { type: String, default: '' },
    issuer: { type: String, default: '' },
    date: { type: String, default: '' },
    credentialId: { type: String, default: '' },
    link: { type: String, default: '' }
  }],
  languages: [{
    name: { type: String, default: '' },
    proficiency: { type: String, default: 'Intermediate' }
  }],
  summary: {
    type: String,
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Resume', resumeSchema);