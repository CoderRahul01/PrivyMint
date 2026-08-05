/**
 * PrivyMint Web — Neon Postgres Data Layer
 *
 * Replaces the ephemeral in-memory store (lib/store.ts) and the local-JSON-file
 * DatabaseService (apps/api/src/db/database.ts) with a real, persistent
 * Postgres backend so purchases/holdings/telemetry survive across serverless
 * invocations and deployments.
 */

import { Pool } from '@neondatabase/serverless';
import type {
  PublicOffering,
  CreateOfferingRequest,
  FeedbackSubmission,
  OnboardingEvent,
  AnalyticsSnapshot,
  OfferingListFilters,
  PaginatedResponse,
} from '@/types/api';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export interface UserRecord {
  commitment: string;
  address?: string | undefined;
  firstSeen: string;
  lastActive: string;
  totalActions: number;
  cohort: string;
}

export interface InvestorHoldingRecord {
  id: string;
  commitment: string;
  offeringId: string;
  offeringName: string;
  collection: string;
  imageUrl: string;
  sharesOwned: number;
  totalShares: number;
  sharePrice: number;
  purchasedAt: string;
  updatedAt: string;
}

export interface TransactionRecord {
  id: string;
  type: 'BUY_SHARES' | 'TRANSFER_SHARES' | 'CLAIM_OWNERSHIP';
  commitment: string;
  offeringId: string;
  offeringName: string;
  shares: number;
  amountDust: number;
  recipientCommitment?: string | undefined;
  timestamp: string;
  zkVerified: boolean;
}

export interface TelemetryEventRecord {
  id: string;
  eventName: string;
  commitment?: string | undefined;
  sessionId: string;
  payload: Record<string, any>;
  timestamp: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ROW MAPPERS
// ─────────────────────────────────────────────────────────────────────────────

function offeringFromRow(row: any): PublicOffering {
  return {
    offeringId: row.offering_id,
    metadataHash: row.metadata_hash,
    metadata: row.metadata,
    totalShares: row.total_shares,
    sharePrice: Number(row.share_price),
    soldShares: row.sold_shares,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    availableShares: row.available_shares,
    soldPercentage: Number(row.sold_percentage),
    totalRaisedDust: Number(row.total_raised_dust),
    marketCapDust: Number(row.market_cap_dust),
  };
}

function holdingFromRow(row: any): InvestorHoldingRecord {
  return {
    id: row.id,
    commitment: row.commitment,
    offeringId: row.offering_id,
    offeringName: row.offering_name,
    collection: row.collection,
    imageUrl: row.image_url,
    sharesOwned: row.shares_owned,
    totalShares: row.total_shares,
    sharePrice: Number(row.share_price),
    purchasedAt: new Date(row.purchased_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function transactionFromRow(row: any): TransactionRecord {
  return {
    id: row.id,
    type: row.type,
    commitment: row.commitment,
    offeringId: row.offering_id,
    offeringName: row.offering_name,
    shares: row.shares,
    amountDust: Number(row.amount_dust),
    recipientCommitment: row.recipient_commitment ?? undefined,
    timestamp: new Date(row.timestamp).toISOString(),
    zkVerified: row.zk_verified,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// OFFERINGS
// ─────────────────────────────────────────────────────────────────────────────

async function getOfferings(): Promise<PublicOffering[]> {
  const { rows } = await pool.query('SELECT * FROM offerings ORDER BY created_at DESC');
  return rows.map(offeringFromRow);
}

async function getOfferingById(id: string): Promise<PublicOffering | undefined> {
  const { rows } = await pool.query('SELECT * FROM offerings WHERE offering_id = $1', [id]);
  return rows[0] ? offeringFromRow(rows[0]) : undefined;
}

async function listOfferings(
  filters: Partial<OfferingListFilters> = {}
): Promise<PaginatedResponse<PublicOffering>> {
  let results = await getOfferings();

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

async function createOffering(req: CreateOfferingRequest): Promise<PublicOffering> {
  const id = crypto.randomUUID();
  const marketCapDust = req.totalShares * req.sharePrice;

  const { rows } = await pool.query(
    `INSERT INTO offerings
      (offering_id, metadata_hash, metadata, total_shares, share_price, sold_shares, status,
       available_shares, sold_percentage, total_raised_dust, market_cap_dust)
     VALUES ($1, $2, $3, $4, $5, 0, 'active', $4, 0, 0, $6)
     RETURNING *`,
    [id, req.metadataHash, JSON.stringify(req.metadata), req.totalShares, req.sharePrice, marketCapDust]
  );
  return offeringFromRow(rows[0]);
}

// ─────────────────────────────────────────────────────────────────────────────
// USERS & HOLDINGS
// ─────────────────────────────────────────────────────────────────────────────

async function touchUser(commitment: string, address?: string): Promise<UserRecord> {
  const { rows } = await pool.query(
    `INSERT INTO users (commitment, address, first_seen, last_active, total_actions, cohort)
     VALUES ($1, $2, now(), now(), 1, 'Active Collector')
     ON CONFLICT (commitment) DO UPDATE SET
       last_active = now(),
       total_actions = users.total_actions + 1,
       address = COALESCE(EXCLUDED.address, users.address)
     RETURNING *`,
    [commitment, address ?? null]
  );
  const row = rows[0];
  return {
    commitment: row.commitment,
    address: row.address ?? undefined,
    firstSeen: new Date(row.first_seen).toISOString(),
    lastActive: new Date(row.last_active).toISOString(),
    totalActions: row.total_actions,
    cohort: row.cohort,
  };
}

async function getUsers(): Promise<UserRecord[]> {
  const { rows } = await pool.query('SELECT * FROM users');
  return rows.map((row) => ({
    commitment: row.commitment,
    address: row.address ?? undefined,
    firstSeen: new Date(row.first_seen).toISOString(),
    lastActive: new Date(row.last_active).toISOString(),
    totalActions: row.total_actions,
    cohort: row.cohort,
  }));
}

async function getHoldingsByCommitment(commitment: string): Promise<InvestorHoldingRecord[]> {
  const { rows } = await pool.query(
    `SELECT h.*, o.metadata->>'name' AS offering_name, o.metadata->>'collection' AS collection,
            o.metadata->>'imageUrl' AS image_url
     FROM holdings h JOIN offerings o ON o.offering_id = h.offering_id
     WHERE h.commitment = $1`,
    [commitment]
  );
  return rows.map(holdingFromRow);
}

async function recordSharePurchase(
  commitment: string,
  offeringId: string,
  sharesToBuy: number
): Promise<{ holding: InvestorHoldingRecord; transaction: TransactionRecord }> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: offeringRows } = await client.query(
      'SELECT * FROM offerings WHERE offering_id = $1 FOR UPDATE',
      [offeringId]
    );
    const offering = offeringRows[0];
    if (!offering) throw new Error('Offering not found');
    if (offering.available_shares < sharesToBuy) throw new Error('Not enough shares available');

    const newSoldShares = offering.sold_shares + sharesToBuy;
    const newAvailableShares = Math.max(0, offering.total_shares - newSoldShares);
    const newSoldPercentage = Math.min(100, (newSoldShares / offering.total_shares) * 100);
    const newTotalRaisedDust = newSoldShares * Number(offering.share_price);
    const newStatus = newAvailableShares === 0 ? 'sold_out' : offering.status;

    await client.query(
      `UPDATE offerings SET sold_shares = $1, available_shares = $2, sold_percentage = $3,
        total_raised_dust = $4, status = $5, updated_at = now() WHERE offering_id = $6`,
      [newSoldShares, newAvailableShares, newSoldPercentage, newTotalRaisedDust, newStatus, offeringId]
    );

    // Users row must exist before holdings can FK-reference it.
    await client.query(
      `INSERT INTO users (commitment, first_seen, last_active, total_actions, cohort)
       VALUES ($1, now(), now(), 1, 'Active Collector')
       ON CONFLICT (commitment) DO UPDATE SET last_active = now(), total_actions = users.total_actions + 1`,
      [commitment]
    );

    const { rows: holdingRows } = await client.query(
      `INSERT INTO holdings (id, commitment, offering_id, shares_owned, total_shares, share_price, purchased_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, now(), now())
       ON CONFLICT (commitment, offering_id) DO UPDATE SET
         shares_owned = holdings.shares_owned + EXCLUDED.shares_owned,
         updated_at = now()
       RETURNING *`,
      [commitment, offeringId, sharesToBuy, offering.total_shares, offering.share_price]
    );

    const offeringName = offering.metadata.name;
    const amountDust = sharesToBuy * Number(offering.share_price);
    const txId = `tx-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`;

    const { rows: txRows } = await client.query(
      `INSERT INTO transactions (id, type, commitment, offering_id, offering_name, shares, amount_dust, "timestamp", zk_verified)
       VALUES ($1, 'BUY_SHARES', $2, $3, $4, $5, $6, now(), true)
       RETURNING *`,
      [txId, commitment, offeringId, offeringName, sharesToBuy, amountDust]
    );

    await client.query('COMMIT');

    const holdingRow = { ...holdingRows[0], offering_name: offeringName, collection: offering.metadata.collection, image_url: offering.metadata.imageUrl };
    return { holding: holdingFromRow(holdingRow), transaction: transactionFromRow(txRows[0]) };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function recordShareTransfer(
  senderCommitment: string,
  recipientCommitment: string,
  offeringId: string,
  shares: number
): Promise<{ transaction: TransactionRecord }> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: senderRows } = await client.query(
      'SELECT * FROM holdings WHERE commitment = $1 AND offering_id = $2 FOR UPDATE',
      [senderCommitment, offeringId]
    );
    const senderHolding = senderRows[0];
    if (!senderHolding || senderHolding.shares_owned < shares) {
      throw new Error('Insufficient private share balance for transfer');
    }

    const { rows: offeringRows } = await client.query(
      'SELECT * FROM offerings WHERE offering_id = $1',
      [offeringId]
    );
    const offering = offeringRows[0];

    const remainingShares = senderHolding.shares_owned - shares;
    if (remainingShares <= 0) {
      await client.query('DELETE FROM holdings WHERE id = $1', [senderHolding.id]);
    } else {
      await client.query(
        'UPDATE holdings SET shares_owned = $1, updated_at = now() WHERE id = $2',
        [remainingShares, senderHolding.id]
      );
    }

    // Recipient's users row must exist before their holdings can FK-reference it.
    await client.query(
      `INSERT INTO users (commitment, first_seen, last_active, total_actions, cohort)
       VALUES ($1, now(), now(), 1, 'Active Collector')
       ON CONFLICT (commitment) DO NOTHING`,
      [recipientCommitment]
    );

    await client.query(
      `INSERT INTO holdings (id, commitment, offering_id, shares_owned, total_shares, share_price, purchased_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, now(), now())
       ON CONFLICT (commitment, offering_id) DO UPDATE SET
         shares_owned = holdings.shares_owned + EXCLUDED.shares_owned,
         updated_at = now()`,
      [recipientCommitment, offeringId, shares, senderHolding.total_shares, senderHolding.share_price]
    );

    const offeringName = offering?.metadata?.name ?? senderHolding.offering_name;
    const amountDust = shares * Number(senderHolding.share_price);
    const txId = `tx-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`;

    const { rows: txRows } = await client.query(
      `INSERT INTO transactions (id, type, commitment, offering_id, offering_name, shares, amount_dust, recipient_commitment, "timestamp", zk_verified)
       VALUES ($1, 'TRANSFER_SHARES', $2, $3, $4, $5, $6, $7, now(), true)
       RETURNING *`,
      [txId, senderCommitment, offeringId, offeringName, shares, amountDust, recipientCommitment]
    );

    await client.query(
      `INSERT INTO users (commitment, first_seen, last_active, total_actions, cohort)
       VALUES ($1, now(), now(), 1, 'Active Collector')
       ON CONFLICT (commitment) DO UPDATE SET last_active = now(), total_actions = users.total_actions + 1`,
      [senderCommitment]
    );
    await client.query(
      `INSERT INTO users (commitment, first_seen, last_active, total_actions, cohort)
       VALUES ($1, now(), now(), 1, 'Active Collector')
       ON CONFLICT (commitment) DO UPDATE SET last_active = now(), total_actions = users.total_actions + 1`,
      [recipientCommitment]
    );

    await client.query('COMMIT');
    return { transaction: transactionFromRow(txRows[0]) };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getTransactions(commitment?: string): Promise<TransactionRecord[]> {
  const { rows } = commitment
    ? await pool.query(
        'SELECT * FROM transactions WHERE commitment = $1 OR recipient_commitment = $1 ORDER BY "timestamp" DESC',
        [commitment]
      )
    : await pool.query('SELECT * FROM transactions ORDER BY "timestamp" DESC');
  return rows.map(transactionFromRow);
}

// ─────────────────────────────────────────────────────────────────────────────
// TELEMETRY & FEEDBACK
// ─────────────────────────────────────────────────────────────────────────────

async function recordTelemetryEvent(
  eventName: string,
  sessionId: string,
  payload: Record<string, any>,
  commitment?: string
): Promise<TelemetryEventRecord> {
  const id = crypto.randomUUID();
  const { rows } = await pool.query(
    `INSERT INTO telemetry_events (id, event_name, commitment, session_id, payload, "timestamp")
     VALUES ($1, $2, $3, $4, $5, now())
     RETURNING *`,
    [id, eventName, commitment ?? null, sessionId, JSON.stringify(payload)]
  );
  if (commitment) await touchUser(commitment);

  const row = rows[0];
  return {
    id: row.id,
    eventName: row.event_name,
    commitment: row.commitment ?? undefined,
    sessionId: row.session_id,
    payload: row.payload,
    timestamp: new Date(row.timestamp).toISOString(),
  };
}

async function saveFeedback(feedback: FeedbackSubmission): Promise<void> {
  await pool.query(
    `INSERT INTO feedback (category, rating, message, wallet_commitment, app_version, page, session_id, submitted_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, now())`,
    [
      feedback.category,
      feedback.rating,
      feedback.message,
      feedback.walletCommitment ?? null,
      feedback.appVersion,
      feedback.page ?? null,
      feedback.sessionId,
    ]
  );
}

async function getFeedback(): Promise<FeedbackSubmission[]> {
  const { rows } = await pool.query('SELECT * FROM feedback ORDER BY submitted_at DESC');
  return rows.map((row) => ({
    category: row.category,
    rating: row.rating,
    message: row.message,
    walletCommitment: row.wallet_commitment ?? undefined,
    appVersion: row.app_version,
    page: row.page ?? undefined,
    sessionId: row.session_id,
  }));
}

let onboardedUsersCount = 12;

async function saveOnboardingEvent(event: OnboardingEvent): Promise<void> {
  await recordTelemetryEvent(event.eventType, event.sessionId, event.metadata ?? {}, event.walletCommitment);
  if (event.eventType === 'onboarding_completed') {
    onboardedUsersCount++;
  }
}

async function getAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  const [offerings, feedback] = await Promise.all([getOfferings(), getFeedback()]);
  const totalRatings = feedback.reduce((sum, f) => sum + f.rating, 0);

  return {
    totalOfferings: offerings.length,
    activeOfferings: offerings.filter((o) => o.status === 'active').length,
    totalSharesSold: offerings.reduce((sum, o) => sum + o.soldShares, 0),
    totalUsersOnboarded: onboardedUsersCount,
    feedbackCount: feedback.length,
    averageRating: feedback.length > 0 ? Math.round((totalRatings / feedback.length) * 10) / 10 : 5.0,
  };
}

export const db = {
  getOfferings,
  getOfferingById,
  listOfferings,
  createOffering,
  touchUser,
  getUsers,
  getHoldingsByCommitment,
  recordSharePurchase,
  recordShareTransfer,
  getTransactions,
  recordTelemetryEvent,
  saveFeedback,
  getFeedback,
  saveOnboardingEvent,
  getAnalyticsSnapshot,
};
