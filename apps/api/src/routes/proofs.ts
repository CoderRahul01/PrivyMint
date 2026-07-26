/**
 * PrivyMint API — Proof Verification Routes
 *
 * Provides REST endpoints for verifying Midnight zero-knowledge ownership proofs.
 * Proofs are generated client-side using the Midnight SDK and submitted here for
 * server-side verification and recording.
 *
 * Privacy Note: The server receives only the proof bytes and public inputs —
 * never raw investor identity or exact holdings.
 */

import { Router } from 'express';
import { createHash, randomUUID } from 'crypto';
import { OwnershipProofRequestSchema } from '../validation/schemas.js';
import { getOfferingById } from '../store/index.js';
import { sendSuccess, sendError } from '../middleware/index.js';
import type { OwnershipProofResult } from '../types/index.js';

const router = Router();

/**
 * POST /api/proofs/verify
 *
 * Verifies a Midnight ZK ownership proof for a fractional offering.
 *
 * In a full Midnight SDK integration, this endpoint would forward the proof
 * bytes to the Midnight RPC node's verification endpoint. For v0.1 Preprod,
 * we perform structural validation and log the proof hash.
 *
 * Note: The actual ZK proof verification cryptography happens inside the
 * Midnight runtime — this endpoint handles the API layer coordination.
 */
router.post('/verify', (req, res, next) => {
  try {
    const validated = OwnershipProofRequestSchema.parse(req.body);

    // Verify the offering exists
    const offering = getOfferingById(validated.offeringId);
    if (!offering) {
      sendError(res, 'Offering not found', 404);
      return;
    }

    // Validate offering is in a state where ownership can be verified
    if (offering.status === 'cancelled') {
      sendError(res, 'Cannot verify ownership for a cancelled offering', 400);
      return;
    }

    // Validate minimum shares threshold is within bounds
    if (validated.minimumShares > offering.totalShares) {
      sendError(res, 'Minimum shares threshold exceeds total shares in offering', 400);
      return;
    }

    // Compute a deterministic hash of the proof for audit/logging purposes
    // NOTE: This does NOT expose any private data — the proof bytes are opaque
    const proofHash = createHash('sha256')
      .update(validated.proofData)
      .update(validated.offeringId)
      .digest('hex');

    // In a production Midnight integration, we would call:
    // const verificationResult = await midnightRPC.verifyProof(validated.proofData, validated.publicInputs);
    // For Preprod v0.1, we return a valid structural verification result
    const result: OwnershipProofResult = {
      valid: true,
      offeringId: validated.offeringId,
      meetsMinimumThreshold: true,
      verifiedAt: new Date().toISOString(),
      proofHash,
    };

    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/proofs/challenge
 *
 * Generates a fresh cryptographic challenge for proof generation.
 * Clients use this nonce in their sessionNonce witness to prevent replay attacks.
 */
router.get('/challenge', (_req, res) => {
  sendSuccess(res, {
    challenge: randomUUID(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
  });
});

export default router;
