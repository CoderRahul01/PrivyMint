/**
 * PrivyMint API — Zod Validation Schemas
 *
 * All incoming request data is validated with Zod before processing.
 * This prevents injection attacks, invalid state, and type mismatches.
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

const HexBytes32 = z.string()
  .regex(/^[0-9a-fA-F]{64}$/, 'Must be a 64-character hex string (32 bytes)');

const DustAmount = z.number()
  .int('Must be an integer')
  .positive('Must be greater than zero')
  .max(1_000_000_000_000, 'Amount exceeds maximum DUST value');

const ShareCount = z.number()
  .int('Must be an integer')
  .positive('Must be greater than zero')
  .max(1_000_000, 'Share count cannot exceed 1,000,000');

// ─────────────────────────────────────────────────────────────────────────────
// OFFERING SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────

const NftAttributeSchema = z.object({
  trait_type: z.string().min(1).max(50),
  value: z.union([z.string().max(100), z.number()]),
  display_type: z.enum(['number', 'boost_percentage', 'boost_number', 'date']).optional(),
});

const OfferingMetadataSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().min(10, 'Description too short').max(2000, 'Description too long'),
  imageUrl: z.string().url('Must be a valid URL'),
  collection: z.string().min(1).max(100),
  category: z.enum([
    'art', 'gaming', 'collectibles', 'real_estate',
    'music', 'sports', 'photography', 'virtual_worlds',
  ]),
  tags: z.array(z.string().max(30)).max(10, 'Too many tags'),
  externalUrl: z.string().url().optional(),
  attributes: z.array(NftAttributeSchema).max(50),
});

export const CreateOfferingSchema = z.object({
  metadataHash: HexBytes32,
  metadata: OfferingMetadataSchema,
  totalShares: ShareCount,
  sharePrice: DustAmount,
  creatorPublicKey: z.string().min(1).max(256),
});

export const OfferingFiltersSchema = z.object({
  category: z.enum([
    'art', 'gaming', 'collectibles', 'real_estate',
    'music', 'sports', 'photography', 'virtual_worlds',
  ]).optional(),
  status: z.enum(['active', 'sold_out', 'cancelled', 'closed']).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['newest', 'price_asc', 'price_desc', 'popularity', 'sold_percentage']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});

// ─────────────────────────────────────────────────────────────────────────────
// PROOF SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────

export const OwnershipProofRequestSchema = z.object({
  offeringId: z.string().uuid('Must be a valid offering UUID'),
  minimumShares: z.number().int().positive(),
  proofData: z.string().min(1, 'Proof data is required'),
  publicInputs: z.array(z.string()).min(1),
});

// ─────────────────────────────────────────────────────────────────────────────
// FEEDBACK SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────

export const FeedbackSchema = z.object({
  category: z.enum(['bug', 'feature_request', 'ux', 'performance', 'documentation', 'general']),
  rating: z.union([
    z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
  ]),
  message: z.string().min(10, 'Message too short').max(2000, 'Message too long'),
  walletCommitment: z.string().max(256).optional(),
  appVersion: z.string().max(20),
  page: z.string().max(100).optional(),
  sessionId: z.string().uuid('Must be a valid session UUID'),
});

export const OnboardingEventSchema = z.object({
  eventType: z.enum([
    'wallet_connected',
    'first_offering_viewed',
    'first_purchase',
    'onboarding_completed',
  ]),
  sessionId: z.string().uuid(),
  walletCommitment: z.string().max(256).optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  timestamp: z.string().datetime(),
});
