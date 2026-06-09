import express from 'express';
import {
  getAllTemplates,
  getTemplatesByCategory,
  getFreeTemplates,
  getPremiumTemplates,
  getTemplateById,
  getTemplateBySlug,
  getTemplateCategories,
  getAllCategories,  // Add this import
  incrementDownloadCount
} from '../controllers/templateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllTemplates);
router.get('/categories', getTemplateCategories);
router.get('/categories/all', getAllCategories);  // Add this new route
router.get('/free', getFreeTemplates);
router.get('/premium', getPremiumTemplates);
router.get('/category/:category', getTemplatesByCategory);
router.get('/slug/:slug', getTemplateBySlug);
router.get('/:id', getTemplateById);

// Protected routes
router.put('/:id/download', protect, incrementDownloadCount);

export default router;