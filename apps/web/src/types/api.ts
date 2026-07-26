/**
 * PrivyMint — Shared Frontend Types
 *
 * Types mirroring the API response shapes for strong frontend typing.
 * Compatible with exactOptionalPropertyTypes.
 */

export type OfferingStatus = 'active' | 'sold_out' | 'cancelled' | 'closed';

export type OfferingCategory =
  | 'art'
  | 'gaming'
  | 'collectibles'
  | 'real_estate'
  | 'music'
  | 'sports'
  | 'photography'
  | 'virtual_worlds';

export type FeedbackCategory =
  | 'bug'
  | 'feature_request'
  | 'ux'
  | 'performance'
  | 'documentation'
  | 'general';

export type FeedbackRating = 1 | 2 | 3 | 4 | 5;

export interface NftAttribute {
  trait_type: string;
  value: string | number;
  display_type?: 'number' | 'boost_percentage' | 'boost_number' | 'date' | undefined;
}

export interface OfferingMetadata {
  id?: string | undefined;
  name: string;
  description: string;
  imageUrl: string;
  collection: string;
  category: OfferingCategory;
  tags: string[];
  externalUrl?: string | undefined;
  attributes: NftAttribute[];
}

export interface PublicOffering {
  offeringId: string;
  metadataHash: string;
  metadata: OfferingMetadata;
  totalShares: number;
  sharePrice: number;
  soldShares: number;
  status: OfferingStatus;
  createdAt: string;
  updatedAt: string;
  availableShares: number;
  soldPercentage: number;
  totalRaisedDust: number;
  marketCapDust: number;
}

export interface OfferingListFilters {
  category?: OfferingCategory | undefined;
  status?: OfferingStatus | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  search?: string | undefined;
  sortBy?: ('newest' | 'price_asc' | 'price_desc' | 'popularity' | 'sold_percentage') | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface CreateOfferingRequest {
  metadataHash: string;
  metadata: OfferingMetadata;
  totalShares: number;
  sharePrice: number;
  creatorPublicKey: string;
}

export interface OwnershipProofRequest {
  offeringId: string;
  minimumShares: number;
  proofData: string;
  publicInputs: string[];
}

export interface OwnershipProofResult {
  valid: boolean;
  offeringId: string;
  meetsMinimumThreshold: boolean;
  verifiedAt: string;
  proofHash: string;
}

export interface FeedbackSubmission {
  category: FeedbackCategory;
  rating: FeedbackRating;
  message: string;
  walletCommitment?: string | undefined;
  appVersion: string;
  page?: string | undefined;
  sessionId: string;
}

export interface OnboardingEvent {
  eventType: 'wallet_connected' | 'first_offering_viewed' | 'first_purchase' | 'onboarding_completed';
  sessionId: string;
  walletCommitment?: string | undefined;
  metadata?: Record<string, string | number | boolean> | undefined;
  timestamp: string;
}

export interface AnalyticsSnapshot {
  totalOfferings: number;
  activeOfferings: number;
  totalSharesSold: number;
  totalUsersOnboarded: number;
  feedbackCount: number;
  averageRating: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T | undefined;
  error?: string | undefined;
  message?: string | undefined;
  timestamp: string;
}

export type WalletConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface WalletState {
  status: WalletConnectionStatus;
  address?: string | undefined;
  commitment?: string | undefined;
  network?: string | undefined;
  error?: string | undefined;
}
