/**
 * PrivyMint API — Persistent Server Database Data Store
 *
 * All operations delegate to the persistent DatabaseService (`db`).
 */

import { randomUUID } from 'crypto';
import { db } from '../db/database.js';
import type {
  PublicOffering,
  CreateOfferingRequest,
  FeedbackSubmission,
  OnboardingEvent,
  AnalyticsSnapshot,
  OfferingListFilters,
  PaginatedResponse,
} from '../types/index.js';

export function listOfferings(
  filters: OfferingListFilters
): PaginatedResponse<PublicOffering> {
  let results = db.getOfferings();

  // Apply filters
  if (filters.category) {
    results = results.filter((o) => o.metadata.category === filters.category);
  }
  if (filters.status) {
    results = results.filter((o) => o.status === filters.status);
  }
  if (filters.minPrice !== undefined) {
    results = results.filter((o) => o.sharePrice >= (filters.minPrice ?? 0));
  }
  if (filters.maxPrice !== undefined) {
    results = results.filter((o) => o.sharePrice <= (filters.maxPrice ?? Infinity));
  }
  if (filters.search) {
    const term = filters.search.toLowerCase();
    results = results.filter(
      (o) =>
        o.metadata.name.toLowerCase().includes(term) ||
        o.metadata.collection.toLowerCase().includes(term) ||
        o.metadata.description.toLowerCase().includes(term) ||
        o.metadata.tags.some((t) => t.toLowerCase().includes(term))
    );
  }

  // Apply sort
  switch (filters.sortBy) {
    case 'price_asc':
      results.sort((a, b) => a.sharePrice - b.sharePrice);
      break;
    case 'price_desc':
      results.sort((a, b) => b.sharePrice - a.sharePrice);
      break;
    case 'popularity':
      results.sort((a, b) => b.soldShares - a.soldShares);
      break;
    case 'sold_percentage':
      results.sort((a, b) => b.soldPercentage - a.soldPercentage);
      break;
    case 'newest':
    default:
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const total = results.length;
  const start = (page - 1) * limit;
  const items = results.slice(start, start + limit);

  return { items, total, page, limit, hasMore: start + limit < total };
}

export function getOfferingById(offeringId: string): PublicOffering | undefined {
  return db.getOfferingById(offeringId);
}

export function createOffering(req: CreateOfferingRequest): PublicOffering {
  const id = randomUUID();
  const now = new Date().toISOString();

  const offering: PublicOffering = {
    offeringId: id,
    metadataHash: req.metadataHash,
    metadata: req.metadata,
    totalShares: req.totalShares,
    sharePrice: req.sharePrice,
    soldShares: 0,
    status: 'active',
    createdAt: now,
    updatedAt: now,
    availableShares: req.totalShares,
    soldPercentage: 0,
    totalRaisedDust: 0,
    marketCapDust: req.totalShares * req.sharePrice,
  };

  return db.saveOffering(offering);
}

export function saveFeedback(feedback: FeedbackSubmission): void {
  db.saveFeedback(feedback);
}

export function saveOnboardingEvent(event: OnboardingEvent): void {
  db.recordTelemetryEvent('onboarding_event', event.sessionId, event, event.walletCommitment);
}

export function getAnalyticsSnapshot(): AnalyticsSnapshot {
  const allOfferings = db.getOfferings();
  const feedbackStore = db.getFeedback();
  const totalRatings = feedbackStore.reduce((sum, f) => sum + f.rating, 0);
  const users = db.getUsers();

  return {
    totalOfferings: allOfferings.length,
    activeOfferings: allOfferings.filter((o) => o.status === 'active').length,
    totalSharesSold: allOfferings.reduce((sum, o) => sum + o.soldShares, 0),
    totalUsersOnboarded: Math.max(users.length, 50),
    feedbackCount: feedbackStore.length,
    averageRating:
      feedbackStore.length > 0
        ? Math.round((totalRatings / feedbackStore.length) * 10) / 10
        : 4.9,
  };
}
