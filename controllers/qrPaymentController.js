import Payment from '../models/Payment.js';
import Template from '../models/Template.js';
import User from '../models/User.js';

// @desc    Create QR payment request
// @route   POST /api/payments/create-qr
// @access  Private
export const createQRPayment = async (req, res) => {
  try {
    const { templateId, transactionId, upiId } = req.body;
    
    // Get template details
    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    if (template.type !== 'premium') {
      return res.status(400).json({ message: 'This template is free' });
    }
    
    // Check if already purchased
    const alreadyPurchased = await Payment.findOne({
      userId: req.user._id,
      templateId,
      status: 'success'
    });
    
    if (alreadyPurchased) {
      return res.status(400).json({ message: 'Template already purchased' });
    }
    
    // Create payment record with transaction ID
    const payment = await Payment.create({
      userId: req.user._id,
      templateId,
      amount: template.price,
      orderId: `QR_${Date.now()}_${req.user._id}`,
      paymentId: transactionId,
      status: 'pending',
      paymentMethod: 'qr_code',
      metadata: {
        upiId: upiId || 'user@okhdfcbank',
        transactionId: transactionId,
        qrCodeGenerated: true
      }
    });
    
    res.json({
      success: true,
      paymentId: payment._id,
      orderId: payment.orderId,
      amount: template.price,
      message: 'QR payment initiated. Please send screenshot to verify.',
      instructions: {
        upiId: 'resumemaker@okhdfcbank', // Your business UPI ID
        amount: template.price,
        note: `Payment for ${template.name} template`
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify QR payment (admin or manual verification)
// @route   POST /api/payments/verify-qr
// @access  Private
export const verifyQRPayment = async (req, res) => {
  try {
    const { paymentId, transactionId, screenshotUrl } = req.body;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Update payment status
    payment.status = 'success';
    payment.completedAt = Date.now();
    payment.metadata = {
      ...payment.metadata,
      verifiedAt: new Date(),
      screenshotUrl: screenshotUrl,
      verifiedTransactionId: transactionId
    };
    await payment.save();
    
    // Add template to user's purchased templates
    await User.findByIdAndUpdate(payment.userId, {
      $addToSet: { purchasedTemplates: payment.templateId }
    });
    
    // Mark user as premium
    const user = await User.findById(payment.userId);
    const premiumTemplatesCount = await Payment.countDocuments({
      userId: payment.userId,
      status: 'success'
    });
    
    if (premiumTemplatesCount > 0 && !user.isPremium) {
      user.isPremium = true;
      await user.save();
    }
    
    res.json({ 
      message: 'Payment verified successfully! Template unlocked.', 
      success: true 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check payment status
// @route   GET /api/payments/status/:paymentId
// @access  Private
export const getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.paymentId,
      userId: req.user._id
    }).populate('templateId');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json({
      status: payment.status,
      template: payment.templateId,
      amount: payment.amount,
      createdAt: payment.createdAt,
      completedAt: payment.completedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's purchased templates
// @route   GET /api/payments/purchased
// @access  Private
export const getPurchasedTemplates = async (req, res) => {
  try {
    const payments = await Payment.find({
      userId: req.user._id,
      status: 'success'
    }).populate('templateId');
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};