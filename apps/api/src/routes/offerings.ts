/**
 * PrivyMint API — Offerings Routes
 *
 * Provides REST endpoints for browsing, searching, and creating
 * fractional NFT offerings. Off-chain metadata indexer.
 */

import { Router } from 'express';
import { CreateOfferingSchema, OfferingFiltersSchema } from '../validation/schemas.js';
import { listOfferings, getOfferingById, createOffering } from '../store/index.js';
import { sendSuccess, sendError } from '../middleware/index.js';

const router = Router();

/**
 * GET /api/offerings
 * List all fractional offerings with optional filtering, sorting, and pagination.
 */
router.get('/', (req, res, next) => {
  try {
    const filters = OfferingFiltersSchema.parse(req.query);
    const result = listOfferings(filters);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/offerings/:id
 * Retrieve a specific offering by its UUID.
 */
router.get('/:id', (req, res, next) => {
  try {
    const offering = getOfferingById(req.params['id'] ?? '');
    if (!offering) {
      sendError(res, 'Offering not found', 404);
      return;
    }
    sendSuccess(res, offering);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/offerings
 * Register a new fractional NFT offering (called after on-chain createFraction circuit).
 * The contract transaction must be confirmed before calling this endpoint.
 */
router.post('/', (req, res, next) => {
  try {
    const validated = CreateOfferingSchema.parse(req.body);
    const offering = createOffering(validated);
    sendSuccess(res, offering, 201);
  } catch (err) {
    next(err);
  }
});

export default router;
