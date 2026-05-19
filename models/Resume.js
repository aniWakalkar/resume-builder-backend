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
    default: 'My Resume'
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  isPremiumTemplate: {
    type: Boolean,
    default: false
  },
  personalInfo: {
    fullName: { type: String, required: true },
    jobTitle: String,
    email: { type: String, required: true },
    phone: String,
    location: String,
    linkedin: String,
    portfolio: String,
    summary: String
  },
  education: [{
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: String,
    startDate: String,
    endDate: String,
    gpa: String,
    description: String
  }],
  experience: [{
    company: { type: String, required: true },
    position: { type: String, required: true },
    location: String,
    startDate: { type: String, required: true },
    endDate: String,
    current: { type: Boolean, default: false },
    responsibilities: [String]
  }],
  skills: {
    technical: [String],
    soft: [String],
    languages: [{ name: String, proficiency: String }]
  },
  projects: [{
    name: { type: String, required: true },
    description: String,
    technologies: [String],
    link: String,
    startDate: String,
    endDate: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    link: String
  }]
}, {
  timestamps: true
});

// Index for faster queries
resumeSchema.index({ userId: 1, createdAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;