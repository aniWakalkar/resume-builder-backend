import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Template from './models/Template.js';

dotenv.config();

const seedTemplates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Delete existing templates
    await Template.deleteMany({});
    
    const templates = [
      // Free Templates
      {
        name: "Classic Professional",
        type: "free",
        price: 0,
        thumbnailUrl: "/templates/classic-thumb.png",
        previewUrl: "/templates/classic-preview.png",
        styles: {
          primaryColor: "#2c3e50",
          fontFamily: "Arial",
          layout: "single-column",
          spacing: "normal"
        },
        features: ["Clean Layout", "Professional", "Easy to Read"],
        isActive: true
      },
      {
        name: "Modern Minimal",
        type: "free",
        price: 0,
        thumbnailUrl: "/templates/modern-thumb.png",
        previewUrl: "/templates/modern-preview.png",
        styles: {
          primaryColor: "#3498db",
          fontFamily: "Poppins",
          layout: "single-column",
          spacing: "compact"
        },
        features: ["Modern Design", "Minimalist", "Great for Tech"],
        isActive: true
      },
      // Premium Templates ($1 each)
      {
        name: "ATS Optimized Pro",
        type: "premium",
        price: 1,
        thumbnailUrl: "/templates/ats-pro-thumb.png",
        previewUrl: "/templates/ats-pro-preview.png",
        styles: {
          primaryColor: "#1a1a2e",
          fontFamily: "Inter",
          layout: "two-column",
          spacing: "compact"
        },
        features: ["ATS-Friendly", "Recruiter Approved", "High Success Rate", "No Watermark"],
        isActive: true
      },
      {
        name: "Executive Elite",
        type: "premium",
        price: 1,
        thumbnailUrl: "/templates/executive-thumb.png",
        previewUrl: "/templates/executive-preview.png",
        styles: {
          primaryColor: "#0f3460",
          fontFamily: "Montserrat",
          layout: "two-column",
          spacing: "relaxed"
        },
        features: ["Executive Style", "Premium Design", "ATS-Friendly", "No Watermark"],
        isActive: true
      },
      {
        name: "Creative Portfolio",
        type: "premium",
        price: 1,
        thumbnailUrl: "/templates/creative-thumb.png",
        previewUrl: "/templates/creative-preview.png",
        styles: {
          primaryColor: "#e94560",
          fontFamily: "Poppins",
          layout: "single-column",
          spacing: "normal"
        },
        features: ["Creative Design", "Perfect for Designers", "Portfolio Ready", "No Watermark"],
        isActive: true
      }
    ];
    
    await Template.insertMany(templates);
    console.log('✅ Templates seeded successfully!');
    console.log(`📊 Created ${templates.length} templates (${templates.filter(t => t.type === 'free').length} free, ${templates.filter(t => t.type === 'premium').length} premium)`);
    process.exit();
  } catch (error) {
    console.error('Error seeding templates:', error);
    process.exit(1);
  }
};

seedTemplates();