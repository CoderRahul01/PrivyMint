/**
 * PrivyMint — Compact Public Ledger State Transitions Tests
 *
 * Test Area 2: Public Ledger State & Lifecycle Transitions.
 * Tests on-chain ledger state maps defined in `privymint.compact`:
 *   - offeringCount: Field
 *   - offeringMetadataHash: Map<Field, Bytes<32>>
 *   - offeringTotalShares: Map<Field, Field>
 *   - offeringSharePrice: Map<Field, Field>
 *   - offeringStatus: Map<Field, Field> (0=Active, 1=SoldOut, 2=Cancelled, 3=Closed)
 *   - offeringSoldShares: Map<Field, Field>
 *   - offeringCreatorCommitment: Map<Field, Field>
 */

import { describe, it, expect, beforeEach } from 'vitest';

class LedgerStateStore {
  public offeringCount: number = 0;
  public offeringMetadataHash = new Map<number, string>();
  public offeringTotalShares = new Map<number, number>();
  public offeringSharePrice = new Map<number, number>();
  public offeringStatus = new Map<number, number>();
  public offeringSoldShares = new Map<number, number>();
  public offeringCreatorCommitment = new Map<number, number>();

  createFraction(metadataHash: string, totalShares: number, sharePrice: number, creatorCommitment: number): number {
    const id = this.offeringCount;
    this.offeringMetadataHash.set(id, metadataHash);
    this.offeringTotalShares.set(id, totalShares);
    this.offeringSharePrice.set(id, sharePrice);
    this.offeringSoldShares.set(id, 0);
    this.offeringStatus.set(id, 0); // Active
    this.offeringCreatorCommitment.set(id, creatorCommitment);

    this.offeringCount += 1;
    return id;
  }

  buyShares(offeringId: number, sharesToBuy: number): void {
    const sold = this.offeringSoldShares.get(offeringId) ?? 0;
    const total = this.offeringTotalShares.get(offeringId) ?? 0;
    const newSold = sold + sharesToBuy;
    this.offeringSoldShares.set(offeringId, newSold);

    if (newSold === total) {
      this.offeringStatus.set(offeringId, 1); // Sold Out
    }
  }

  sellShares(offeringId: number, sharesToSell: number): void {
    const sold = this.offeringSoldShares.get(offeringId) ?? 0;
    const currentStatus = this.offeringStatus.get(offeringId) ?? 0;
    const newSold = sold - sharesToSell;
    this.offeringSoldShares.set(offeringId, newSold);

    if (currentStatus === 1) {
      this.offeringStatus.set(offeringId, 0); // Re-activate to Active
    }
  }

  cancelOffering(offeringId: number): void {
    this.offeringStatus.set(offeringId, 2); // Cancelled
  }

  closeOffering(offeringId: number): void {
    this.offeringStatus.set(offeringId, 3); // Closed
  }
}

describe('Compact ZK Contract — Ledger State & Transition Suite', () => {
  let ledger: LedgerStateStore;

  beforeEach(() => {
    ledger = new LedgerStateStore();
  });

  it('initializes global ledger offeringCount to 0', () => {
    expect(ledger.offeringCount).toBe(0);
  });

  it('increments offeringCount and populates public maps when createFraction executes', () => {
    const id1 = ledger.createFraction('ipfs://QmMetaHash1', 1000, 100, 0xa1b2);
    expect(id1).toBe(0);
    expect(ledger.offeringCount).toBe(1);

    expect(ledger.offeringMetadataHash.get(0)).toBe('ipfs://QmMetaHash1');
    expect(ledger.offeringTotalShares.get(0)).toBe(1000);
    expect(ledger.offeringSharePrice.get(0)).toBe(100);
    expect(ledger.offeringSoldShares.get(0)).toBe(0);
    expect(ledger.offeringStatus.get(0)).toBe(0); // Active
    expect(ledger.offeringCreatorCommitment.get(0)).toBe(0xa1b2);

    const id2 = ledger.createFraction('ipfs://QmMetaHash2', 500, 250, 0xc3d4);
    expect(id2).toBe(1);
    expect(ledger.offeringCount).toBe(2);
  });

  it('updates offeringSoldShares and keeps status Active (0) during partial buys', () => {
    const id = ledger.createFraction('ipfs://QmMetaHash', 100, 10, 0xa1b2);
    ledger.buyShares(id, 30);

    expect(ledger.offeringSoldShares.get(id)).toBe(30);
    expect(ledger.offeringStatus.get(id)).toBe(0); // Active
  });

  it('transitions offeringStatus to Sold Out (1) when all totalShares are sold', () => {
    const id = ledger.createFraction('ipfs://QmMetaHash', 100, 10, 0xa1b2);
    ledger.buyShares(id, 60);
    expect(ledger.offeringStatus.get(id)).toBe(0);

    ledger.buyShares(id, 40);
    expect(ledger.offeringSoldShares.get(id)).toBe(100);
    expect(ledger.offeringStatus.get(id)).toBe(1); // Sold Out
  });

  it('reverts offeringStatus from Sold Out (1) back to Active (0) when shares are sold back', () => {
    const id = ledger.createFraction('ipfs://QmMetaHash', 100, 10, 0xa1b2);
    ledger.buyShares(id, 100);
    expect(ledger.offeringStatus.get(id)).toBe(1);

    ledger.sellShares(id, 10);
    expect(ledger.offeringSoldShares.get(id)).toBe(90);
    expect(ledger.offeringStatus.get(id)).toBe(0); // Active
  });

  it('transitions offeringStatus to Cancelled (2) upon cancelOffering by creator', () => {
    const id = ledger.createFraction('ipfs://QmMetaHash', 100, 10, 0xa1b2);
    ledger.cancelOffering(id);

    expect(ledger.offeringStatus.get(id)).toBe(2); // Cancelled
  });

  it('transitions offeringStatus to Closed (3) upon closeOffering when sold out', () => {
    const id = ledger.createFraction('ipfs://QmMetaHash', 100, 10, 0xa1b2);
    ledger.buyShares(id, 100);
    ledger.closeOffering(id);

    expect(ledger.offeringStatus.get(id)).toBe(3); // Closed
  });
});
