import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { PublicOffering, CreateOfferingRequest, FeedbackSubmission } from '../types/index.js';

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

interface DatabaseSchema {
  offerings: Record<string, PublicOffering>;
  users: Record<string, UserRecord>;
  holdings: Record<string, InvestorHoldingRecord>;
  transactions: TransactionRecord[];
  telemetryEvents: TelemetryEventRecord[];
  feedback: FeedbackSubmission[];
}

const DB_FILE_PATH = path.resolve(process.cwd(), 'privymint_db.json');

const INITIAL_SEED_OFFERINGS: PublicOffering[] = [
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
      description: 'Prime virtual land in the Shadow Realm metaverse. Located adjacent to central trade hub, generating passive yield from marketplace traffic.',
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
      description: 'The rarest sword in Midnight Chronicles of the Void gaming universe. Used by Season 1 champion.',
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

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadFromDisk();
  }

  private loadFromDisk(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.warn('Could not parse database file, initializing clean database schema:', err);
    }

    const initialOfferings: Record<string, PublicOffering> = {};
    for (const o of INITIAL_SEED_OFFERINGS) {
      initialOfferings[o.offeringId] = o;
    }

    const defaultSchema: DatabaseSchema = {
      offerings: initialOfferings,
      users: {},
      holdings: {},
      transactions: [],
      telemetryEvents: [],
      feedback: [],
    };

    this.saveToDisk(defaultSchema);
    return defaultSchema;
  }

  private saveToDisk(schema?: DatabaseSchema): void {
    try {
      const content = JSON.stringify(schema ?? this.data, null, 2);
      fs.writeFileSync(DB_FILE_PATH, content, 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // --- OFFERINGS API ---
  public getOfferings(): PublicOffering[] {
    return Object.values(this.data.offerings);
  }

  public getOfferingById(id: string): PublicOffering | undefined {
    return this.data.offerings[id];
  }

  public saveOffering(offering: PublicOffering): PublicOffering {
    this.data.offerings[offering.offeringId] = offering;
    this.saveToDisk();
    return offering;
  }

  // --- USER & HOLDINGS API ---
  public touchUser(commitment: string, address?: string): UserRecord {
    const existing = this.data.users[commitment];
    const now = new Date().toISOString();

    const updated: UserRecord = {
      commitment,
      address: address ?? existing?.address,
      firstSeen: existing?.firstSeen ?? now,
      lastActive: now,
      totalActions: (existing?.totalActions ?? 0) + 1,
      cohort: existing?.cohort ?? 'Active Collector',
    };

    this.data.users[commitment] = updated;
    this.saveToDisk();
    return updated;
  }

  public getUsers(): UserRecord[] {
    return Object.values(this.data.users);
  }

  public getHoldingsByCommitment(commitment: string): InvestorHoldingRecord[] {
    return Object.values(this.data.holdings).filter((h) => h.commitment === commitment);
  }

  public recordSharePurchase(
    commitment: string,
    offeringId: string,
    sharesToBuy: number
  ): { holding: InvestorHoldingRecord; transaction: TransactionRecord } {
    const offering = this.getOfferingById(offeringId);
    if (!offering) throw new Error('Offering not found');
    if (offering.availableShares < sharesToBuy) throw new Error('Not enough shares available');

    // Update offering stats
    offering.soldShares += sharesToBuy;
    offering.availableShares = Math.max(0, offering.totalShares - offering.soldShares);
    offering.soldPercentage = Math.min(100, (offering.soldShares / offering.totalShares) * 100);
    offering.totalRaisedDust = offering.soldShares * offering.sharePrice;
    if (offering.availableShares === 0) offering.status = 'sold_out';
    offering.updatedAt = new Date().toISOString();
    this.saveOffering(offering);

    // Update holdings
    const holdingKey = `${commitment}_${offeringId}`;
    const existingHolding = this.data.holdings[holdingKey];
    const now = new Date().toISOString();

    const updatedHolding: InvestorHoldingRecord = {
      id: existingHolding?.id ?? randomUUID(),
      commitment,
      offeringId,
      offeringName: offering.metadata.name,
      collection: offering.metadata.collection,
      imageUrl: offering.metadata.imageUrl,
      sharesOwned: (existingHolding?.sharesOwned ?? 0) + sharesToBuy,
      totalShares: offering.totalShares,
      sharePrice: offering.sharePrice,
      purchasedAt: existingHolding?.purchasedAt ?? now,
      updatedAt: now,
    };

    this.data.holdings[holdingKey] = updatedHolding;

    // Record Transaction
    const transaction: TransactionRecord = {
      id: `tx-${Date.now()}-${randomUUID().slice(0, 6)}`,
      type: 'BUY_SHARES',
      commitment,
      offeringId,
      offeringName: offering.metadata.name,
      shares: sharesToBuy,
      amountDust: sharesToBuy * offering.sharePrice,
      timestamp: now,
      zkVerified: true,
    };

    this.data.transactions.unshift(transaction);
    this.touchUser(commitment);
    this.saveToDisk();

    return { holding: updatedHolding, transaction };
  }

  public recordShareTransfer(
    senderCommitment: string,
    recipientCommitment: string,
    offeringId: string,
    shares: number
  ): { transaction: TransactionRecord } {
    const senderKey = `${senderCommitment}_${offeringId}`;
    const senderHolding = this.data.holdings[senderKey];

    if (!senderHolding || senderHolding.sharesOwned < shares) {
      throw new Error('Insufficient private share balance for transfer');
    }

    const offering = this.getOfferingById(offeringId);
    const now = new Date().toISOString();

    // Deduct from sender
    senderHolding.sharesOwned -= shares;
    if (senderHolding.sharesOwned <= 0) {
      delete this.data.holdings[senderKey];
    } else {
      senderHolding.updatedAt = now;
    }

    // Add to recipient
    const recipientKey = `${recipientCommitment}_${offeringId}`;
    const recipientHolding = this.data.holdings[recipientKey];
    this.data.holdings[recipientKey] = {
      id: recipientHolding?.id ?? randomUUID(),
      commitment: recipientCommitment,
      offeringId,
      offeringName: offering?.metadata.name ?? senderHolding.offeringName,
      collection: offering?.metadata.collection ?? senderHolding.collection,
      imageUrl: offering?.metadata.imageUrl ?? senderHolding.imageUrl,
      sharesOwned: (recipientHolding?.sharesOwned ?? 0) + shares,
      totalShares: senderHolding.totalShares,
      sharePrice: senderHolding.sharePrice,
      purchasedAt: recipientHolding?.purchasedAt ?? now,
      updatedAt: now,
    };

    const transaction: TransactionRecord = {
      id: `tx-${Date.now()}-${randomUUID().slice(0, 6)}`,
      type: 'TRANSFER_SHARES',
      commitment: senderCommitment,
      recipientCommitment,
      offeringId,
      offeringName: senderHolding.offeringName,
      shares,
      amountDust: shares * senderHolding.sharePrice,
      timestamp: now,
      zkVerified: true,
    };

    this.data.transactions.unshift(transaction);
    this.touchUser(senderCommitment);
    this.touchUser(recipientCommitment);
    this.saveToDisk();

    return { transaction };
  }

  public getTransactions(commitment?: string): TransactionRecord[] {
    if (!commitment) return this.data.transactions;
    return this.data.transactions.filter(
      (tx) => tx.commitment === commitment || tx.recipientCommitment === commitment
    );
  }

  // --- TELEMETRY & ANALYTICS API ---
  public recordTelemetryEvent(
    eventName: string,
    sessionId: string,
    payload: Record<string, any>,
    commitment?: string
  ): TelemetryEventRecord {
    const record: TelemetryEventRecord = {
      id: randomUUID(),
      eventName,
      sessionId,
      commitment,
      payload,
      timestamp: new Date().toISOString(),
    };

    this.data.telemetryEvents.unshift(record);
    if (commitment) this.touchUser(commitment);
    this.saveToDisk();
    return record;
  }

  public getTelemetryEvents(): TelemetryEventRecord[] {
    return this.data.telemetryEvents;
  }

  public saveFeedback(feedback: FeedbackSubmission): void {
    this.data.feedback.unshift(feedback);
    this.saveToDisk();
  }

  public getFeedback(): FeedbackSubmission[] {
    return this.data.feedback;
  }
}

export const db = new DatabaseService();
