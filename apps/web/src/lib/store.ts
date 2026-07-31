/**
 * PrivyMint Web — In-Memory Store & Serverless Data Layer
 *
 * Provides instant, zero-latency serverless data store for Vercel deployment.
 * Ensures all API routes (/api/offerings, /api/proofs, /api/feedback) work natively on Vercel.
 */

import type {
  PublicOffering,
  CreateOfferingRequest,
  FeedbackSubmission,
  OnboardingEvent,
  AnalyticsSnapshot,
  OfferingListFilters,
  PaginatedResponse,
} from '@/types/api';

const SEED_OFFERINGS: PublicOffering[] = [
  {
    offeringId: '550e8400-e29b-41d4-a716-446655440001',
    metadataHash: 'a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    metadata: {
      name: 'Celestial Apex #001',
      description: 'A rare 1-of-1 generative art piece from the Celestial Apex collection, featuring algorithmic aurora compositions on the Midnight canvas.',
      imageUrl: 'https://picsum.photos/seed/celestial001/800/800',
      collection: 'Celestial Apex',
      category: 'art',
      tags: ['generative', '1-of-1', 'aurora', 'algorithmic'],
      attributes: [
        { trait_type: 'Rarity', value: 'Legendary' },
        { trait_type: 'Generation', value: 1 },
        { trait_type: 'Algorithm', value: 'Aurora-V2' },
      ],
    },
    totalShares: 10000,
    sharePrice: 50000,
    soldShares: 3420,
    status: 'active',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    availableShares: 6580,
    soldPercentage: 34.2,
    totalRaisedDust: 3420 * 50000,
    marketCapDust: 10000 * 50000,
  },
  {
    offeringId: '550e8400-e29b-41d4-a716-446655440002',
    metadataHash: 'b4e9f1d2a5c8e3f0b7d4a1c6e9f2b5d8a3c6f0b3d6a9c2f5b8e1d4a7c0f3b6e9',
    metadata: {
      name: 'Shadow Realm Land Parcel #0047',
      description: 'Prime virtual land in the Shadow Realm metaverse. Located adjacent to the central trade hub, this parcel generates passive yield from marketplace traffic.',
      imageUrl: 'https://picsum.photos/seed/shadowrealm047/800/800',
      collection: 'Shadow Realm',
      category: 'virtual_worlds',
      tags: ['metaverse', 'land', 'yield', 'prime-location'],
      attributes: [
        { trait_type: 'Zone', value: 'Central Hub' },
        { trait_type: 'Size', value: '256x256' },
        { trait_type: 'Traffic Multiplier', value: 3.2, display_type: 'number' },
      ],
    },
    totalShares: 5000,
    sharePrice: 120000,
    soldShares: 4890,
    status: 'active',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    availableShares: 110,
    soldPercentage: 97.8,
    totalRaisedDust: 4890 * 120000,
    marketCapDust: 5000 * 120000,
  },
  {
    offeringId: '550e8400-e29b-41d4-a716-446655440003',
    metadataHash: 'c5f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0b2',
    metadata: {
      name: 'Void Phantom — Championship Edition',
      description: "The rarest sword in Midnight's Chronicles of the Void gaming universe. Used by the Season 1 champion. Grants unique passive bonuses and exclusive cosmetic effects.",
      imageUrl: 'https://picsum.photos/seed/voidphantom/800/800',
      collection: 'Chronicles of the Void',
      category: 'gaming',
      tags: ['gaming', 'weapon', 'championship', 'legendary'],
      attributes: [
        { trait_type: 'Class', value: 'Legendary Weapon' },
        { trait_type: 'Attack Bonus', value: 420, display_type: 'number' },
        { trait_type: 'Season', value: 'Season 1' },
      ],
    },
    totalShares: 1000,
    sharePrice: 250000,
    soldShares: 1000,
    status: 'sold_out',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    availableShares: 0,
    soldPercentage: 100,
    totalRaisedDust: 1000 * 250000,
    marketCapDust: 1000 * 250000,
  },
];

const offeringsMap = new Map<string, PublicOffering>(
  SEED_OFFERINGS.map((o) => [o.offeringId, o])
);

const feedbackList: FeedbackSubmission[] = [];
const onboardingList: OnboardingEvent[] = [];
let onboardedUsersCount = 12;

export function listOfferingsServerless(
  filters: Partial<OfferingListFilters> = {}
): PaginatedResponse<PublicOffering> {
  let results = Array.from(offeringsMap.values());

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

  const page = Number(filters.page ?? 1);
  const limit = Number(filters.limit ?? 12);
  const total = results.length;
  const start = (page - 1) * limit;
  const items = results.slice(start, start + limit);

  return { items, total, page, limit, hasMore: start + limit < total };
}

export function getOfferingByIdServerless(id: string): PublicOffering | undefined {
  return offeringsMap.get(id);
}

export function createOfferingServerless(req: CreateOfferingRequest): PublicOffering {
  const id = crypto.randomUUID();
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

  offeringsMap.set(id, offering);
  return offering;
}

export function saveFeedbackServerless(feedback: FeedbackSubmission): void {
  feedbackList.push(feedback);
}

export function saveOnboardingEventServerless(event: OnboardingEvent): void {
  onboardingList.push(event);
  if (event.eventType === 'onboarding_completed') {
    onboardedUsersCount++;
  }
}

export function getAnalyticsSnapshotServerless(): AnalyticsSnapshot {
  const allOfferings = Array.from(offeringsMap.values());
  const totalRatings = feedbackList.reduce((sum, f) => sum + f.rating, 0);

  return {
    totalOfferings: allOfferings.length,
    activeOfferings: allOfferings.filter((o) => o.status === 'active').length,
    totalSharesSold: allOfferings.reduce((sum, o) => sum + o.soldShares, 0),
    totalUsersOnboarded: onboardedUsersCount,
    feedbackCount: feedbackList.length,
    averageRating:
      feedbackList.length > 0 ? Math.round((totalRatings / feedbackList.length) * 10) / 10 : 5.0,
  };
}
