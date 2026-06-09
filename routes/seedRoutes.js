import express from 'express';
import Template from '../models/Template.js';
import Category from '../models/Category.js';
import { templateData } from '../data/templates.js';
import { categoryData } from '../data/categories.js';

const router = express.Router();

// Seed categories into database
router.post('/seed/categories', async (req, res) => {
  try {
    await Category.deleteMany({});
    console.log('Existing categories cleared');
    
    const inserted = await Category.insertMany(categoryData);
    console.log(`${inserted.length} categories inserted successfully`);
    
    res.status(201).json({
      success: true,
      message: `${inserted.length} categories seeded successfully`,
      count: inserted.length,
      data: inserted
    });
  } catch (error) {
    console.error('Seed categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed categories',
      error: error.message
    });
  }
});

// Seed templates into database
router.post('/seed/templates', async (req, res) => {
  try {
    await Template.deleteMany({});
    console.log('Existing templates cleared');
    
    const inserted = await Template.insertMany(templateData);
    console.log(`${inserted.length} templates inserted successfully`);
    
    res.status(201).json({
      success: true,
      message: `${inserted.length} templates seeded successfully`,
      count: inserted.length,
      data: inserted
    });
  } catch (error) {
    console.error('Seed templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed templates',
      error: error.message
    });
  }
});

// Seed everything
router.post('/seed/all', async (req, res) => {
  try {
    // Seed categories
    await Category.deleteMany({});
    const categories = await Category.insertMany(categoryData);
    console.log(`${categories.length} categories seeded`);
    
    // Seed templates
    await Template.deleteMany({});
    const templates = await Template.insertMany(templateData);
    console.log(`${templates.length} templates seeded`);
    
    res.status(201).json({
      success: true,
      message: 'Database seeded successfully',
      categories: {
        count: categories.length,
        data: categories
      },
      templates: {
        count: templates.length,
        data: templates
      }
    });
  } catch (error) {
    console.error('Seed all error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

// Get seed status
router.get('/seed/status', async (req, res) => {
  try {
    const categoryCount = await Category.countDocuments();
    const templateCount = await Template.countDocuments();
    const categories = await Category.find().sort({ order: 1 });
    
    res.status(200).json({
      success: true,
      hasData: templateCount > 0,
      categories: {
        count: categoryCount,
        data: categories
      },
      templates: {
        count: templateCount
      },
      message: templateCount > 0 ? 'Database has template data' : 'No template data found. Run POST /api/seed/all to seed data.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check seed status',
      error: error.message
    });
  }
});

export default router;