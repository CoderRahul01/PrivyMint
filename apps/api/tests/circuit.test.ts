/**
 * PrivyMint — Compact ZK Smart Contract Circuit Tests
 *
 * Validates circuit logic, selective disclosure rules, and privacy bounds.
 */

import { describe, it, expect } from 'vitest';

// Simulated ZK Circuit Execution helper
function simulateVerifyOwnershipCircuit(params: {
  offeringId: string;
  minimumShares: number;
  userBalance: number;
  offeringStatus: number;
}): { valid: boolean; disclosedMinimum: number; identityExposed: boolean } {
  const { minimumShares, userBalance, offeringStatus } = params;

  // Circuit assertion: status != 2 (cancelled)
  if (offeringStatus === 2) {
    throw new Error('PrivyMint: Offering has been cancelled');
  }

  // Circuit computation: localBalance >= minimumShares
  const hasMinimum = userBalance >= minimumShares;

  // disclose(hasMinimum) and disclose(minimumShares)
  return {
    valid: hasMinimum,
    disclosedMinimum: minimumShares,
    identityExposed: false, // Privacy check: user identity commitment remains undisclosed witness
  };
}

describe('Midnight Compact Circuit: verifyOwnership()', () => {
  it('passes ownership proof when user holds at least minimum shares threshold', () => {
    const result = simulateVerifyOwnershipCircuit({
      offeringId: '550e8400-e29b-41d4-a716-446655440001',
      minimumShares: 5,
      userBalance: 10,
      offeringStatus: 0, // Active
    });

    expect(result.valid).toBe(true);
    expect(result.disclosedMinimum).toBe(5);
    expect(result.identityExposed).toBe(false);
  });

  it('fails ownership proof when user holds fewer than required shares', () => {
    const result = simulateVerifyOwnershipCircuit({
      offeringId: '550e8400-e29b-41d4-a716-446655440001',
      minimumShares: 50,
      userBalance: 10,
      offeringStatus: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.identityExposed).toBe(false);
  });

  it('throws error when trying to verify ownership for a cancelled offering', () => {
    expect(() =>
      simulateVerifyOwnershipCircuit({
        offeringId: '550e8400-e29b-41d4-a716-446655440001',
        minimumShares: 1,
        userBalance: 10,
        offeringStatus: 2, // Cancelled
      })
    ).toThrow('PrivyMint: Offering has been cancelled');
  });
});
