import Template from '../models/Template.js';
import Category from '../models/Category.js';
// @desc    Get all active templates
// @route   GET /api/templates
// @access  Public
export const getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ isActive: true }).sort({ price: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get templates by category (fresher/experienced/creative/modern/executive)
// @route   GET /api/templates/category/:category
// @access  Public
export const getTemplatesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const templates = await Template.find({ 
      category: category, 
      isActive: true 
    }).sort({ price: 1 });
    
    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get free templates
// @route   GET /api/templates/free
// @access  Public
export const getFreeTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ 
      type: 'free', 
      isActive: true 
    }).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get premium templates
// @route   GET /api/templates/premium
// @access  Public
export const getPremiumTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ 
      type: 'premium', 
      isActive: true 
    }).sort({ price: 1 });
    
    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get template by ID
// @route   GET /api/templates/:id
// @access  Public
export const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template || !template.isActive) {
      return res.status(404).json({ 
        success: false, 
        message: 'Template not found' 
      });
    }
    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get template by slug
// @route   GET /api/templates/slug/:slug
// @access  Public
export const getTemplateBySlug = async (req, res) => {
  try {
    const template = await Template.findOne({ slug: req.params.slug, isActive: true });
    if (!template) {
      return res.status(404).json({ 
        success: false, 
        message: 'Template not found' 
      });
    }
    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get available categories with counts
// @route   GET /api/templates/categories
// @access  Public
export const getTemplateCategories = async (req, res) => {
  try {
    const categories = await Template.aggregate([
      { $match: { isActive: true } },
      { $group: {
        _id: '$category',
        count: { $sum: 1 },
        templates: { $push: '$$ROOT' }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    const categoryMetadata = {
      fresher: {
        title: 'Fresher / Entry Level',
        description: 'Recent graduate with limited work experience',
        icon: '🎓',
        color: 'blue'
      },
      experienced: {
        title: 'Experienced',
        description: 'Have professional work experience',
        icon: '💼',
        color: 'purple'
      },
      creative: {
        title: 'Creative Professional',
        description: 'For designers, artists, and creative roles',
        icon: '🎨',
        color: 'pink'
      },
      modern: {
        title: 'Modern Professional',
        description: 'Clean, modern design for tech professionals',
        icon: '💻',
        color: 'green'
      },
      executive: {
        title: 'Executive Leadership',
        description: 'For senior management and C-suite positions',
        icon: '👔',
        color: 'slate'
      }
    };
    
    const result = categories.map(cat => ({
      id: cat._id,
      title: categoryMetadata[cat._id]?.title || cat._id,
      description: categoryMetadata[cat._id]?.description || `${cat._id} templates`,
      icon: categoryMetadata[cat._id]?.icon || '📄',
      color: categoryMetadata[cat._id]?.color || 'gray',
      count: cat.count,
      templates: cat.templates
    }));
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Increment template download count
// @route   PUT /api/templates/:id/download
// @access  Private
export const incrementDownloadCount = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ 
        success: false, 
        message: 'Template not found' 
      });
    }
    
    template.downloadCount += 1;
    await template.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Download count updated',
      downloadCount: template.downloadCount
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


// @desc    Get all categories with template counts
// @route   GET /api/templates/categories/all
// @access  Public
export const getAllCategories = async (req, res) => {
  try {
    // Get all categories from database
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    
    // Get counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Template.countDocuments({ category: cat.id, isActive: true });
        return {
          id: cat.id,
          title: cat.title,
          description: cat.description,
          icon: cat.icon,
          color: cat.color,
          order: cat.order,
          count: count
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: categoriesWithCounts
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
