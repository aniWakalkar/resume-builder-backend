import express from 'express';
import {
  createQRPayment,
  verifyQRPayment,
  getPaymentStatus,
  getPurchasedTemplates
} from '../controllers/qrPaymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-qr', protect, createQRPayment);
router.post('/verify-qr', protect, verifyQRPayment);
router.get('/status/:paymentId', protect, getPaymentStatus);
router.get('/purchased', protect, getPurchasedTemplates);

export default router;