import express from 'express';
import {
  subscribeToNewsletter,
  getNewsletterStats,
  addSubscriberTags,
  batchSubscribe
} from '../controllers/mailchimp.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// Public route for subscription
router.post('/subscribe', subscribeToNewsletter);

// Admin routes
router.get('/stats', verifyAdmin, getNewsletterStats);
router.post('/tags', verifyAdmin, addSubscriberTags);
router.post('/batch-subscribe', verifyAdmin, batchSubscribe);

export default router;