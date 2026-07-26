/**
 * PrivyMint API — Feedback & Analytics Routes
 *
 * Supports Midnight Moonshots Level 5 requirement: user feedback collection,
 * onboarding event tracking, and analytics snapshot for evaluators.
 *
 * Privacy Note: Feedback submissions are anonymous. Wallet addresses are
 * never collected — only optional ZK commitment hashes that cannot be
 * reverse-engineered to identify the investor.
 */

import { Router } from 'express';
import { FeedbackSchema, OnboardingEventSchema } from '../validation/schemas.js';
import { saveFeedback, saveOnboardingEvent, getAnalyticsSnapshot } from '../store/index.js';
import { sendSuccess } from '../middleware/index.js';

const router = Router();

/**
 * POST /api/feedback
 * Submit user feedback. Supports bug reports, feature requests, and UX feedback.
 * Anonymous by default — wallet commitment is optional.
 */
router.post('/', (req, res, next) => {
  try {
    const validated = FeedbackSchema.parse(req.body);
    saveFeedback(validated);
    sendSuccess(res, { received: true, message: 'Thank you for your feedback!' }, 201);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/feedback/onboarding
 * Track user onboarding milestones (wallet connect, first view, first purchase).
 * Used for Moonshots Level 5 user traction metrics.
 */
router.post('/onboarding', (req, res, next) => {
  try {
    const validated = OnboardingEventSchema.parse(req.body);
    saveOnboardingEvent(validated);
    sendSuccess(res, { tracked: true }, 201);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/feedback/analytics
 * Retrieve aggregate analytics for the PrivyMint platform.
 * Used by evaluators and the creator dashboard.
 * Returns only aggregate statistics — no individual user data is exposed.
 */
router.get('/analytics', (_req, res) => {
  const snapshot = getAnalyticsSnapshot();
  sendSuccess(res, snapshot);
});

export default router;
