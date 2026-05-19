import Template from '../models/Template.js';

// @desc    Get all active templates
// @route   GET /api/templates
// @access  Public
export const getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ isActive: true }).sort({ price: 1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get free templates
// @route   GET /api/templates/free
// @access  Public
export const getFreeTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ type: 'free', isActive: true });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get premium templates
// @route   GET /api/templates/premium
// @access  Public
export const getPremiumTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ type: 'premium', isActive: true });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get template by ID
// @route   GET /api/templates/:id
// @access  Public
export const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template || !template.isActive) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Increment template download count
// @route   PUT /api/templates/:id/download
// @access  Private
export const incrementDownloadCount = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    template.downloadCount += 1;
    await template.save();
    
    res.json({ message: 'Download count updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};