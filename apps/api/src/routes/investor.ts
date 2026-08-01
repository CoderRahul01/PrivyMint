import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { trackServerEvent } from '../services/posthog.js';
import { sendSuccess, sendError } from '../middleware/index.js';

const router = Router();

const BuySharesSchema = z.object({
  commitment: z.string().min(6),
  offeringId: z.string().uuid(),
  sharesToBuy: z.number().int().positive(),
  address: z.string().optional(),
});

const TransferSharesSchema = z.object({
  senderCommitment: z.string().min(6),
  recipientCommitment: z.string().min(6),
  offeringId: z.string().uuid(),
  shares: z.number().int().positive(),
});

/**
 * GET /api/investor/holdings
 * Fetch user's server-persisted ZK holdings by identity commitment.
 */
router.get('/holdings', (req, res, next) => {
  try {
    const commitment = (req.query['commitment'] as string) ?? '';
    if (!commitment) {
      sendError(res, 'Missing commitment parameter', 400);
      return;
    }
    const holdings = db.getHoldingsByCommitment(commitment);
    sendSuccess(res, holdings);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/investor/buy
 * Execute server-persisted share purchase.
 */
router.post('/buy', (req, res, next) => {
  try {
    const { commitment, offeringId, sharesToBuy, address } = BuySharesSchema.parse(req.body);
    const result = db.recordSharePurchase(commitment, offeringId, sharesToBuy);

    trackServerEvent(commitment, 'share_purchased', {
      offeringId,
      sharesToBuy,
      totalAmountDust: result.transaction.amountDust,
      address,
    });

    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/investor/transfer
 * Execute server-persisted private share transfer.
 */
router.post('/transfer', (req, res, next) => {
  try {
    const { senderCommitment, recipientCommitment, offeringId, shares } = TransferSharesSchema.parse(req.body);
    const result = db.recordShareTransfer(senderCommitment, recipientCommitment, offeringId, shares);

    trackServerEvent(senderCommitment, 'share_transferred', {
      offeringId,
      shares,
      recipientCommitment,
    });

    sendSuccess(res, result, 200);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/investor/transactions
 * Fetch server-persisted transactions.
 */
router.get('/transactions', (req, res, next) => {
  try {
    const commitment = (req.query['commitment'] as string) ?? undefined;
    const transactions = db.getTransactions(commitment);
    sendSuccess(res, transactions);
  } catch (err) {
    next(err);
  }
});

export default router;
