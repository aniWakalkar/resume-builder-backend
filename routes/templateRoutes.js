import express from 'express';
import {
  getAllTemplates,
  getFreeTemplates,
  getPremiumTemplates,
  getTemplateById,
  incrementDownloadCount
} from '../controllers/templateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllTemplates);
router.get('/free', getFreeTemplates);
router.get('/premium', getPremiumTemplates);
router.get('/:id', getTemplateById);
router.put('/:id/download', protect, incrementDownloadCount);

export default router;