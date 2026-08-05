/**
 * PrivyMint — Compact ZK Smart Contract Circuit Logic Tests
 *
 * Test Area 1: Circuit logic, input assertions, pre-conditions, and execution flow.
 * Validates all 8 circuits defined in `privymint.compact`:
 *   1. createFraction
 *   2. buyShares
 *   3. sellShares
 *   4. transferShares
 *   5. claimOwnership
 *   6. verifyOwnership
 *   7. cancelOffering
 *   8. closeOffering
 */

import { describe, it, expect } from 'vitest';

// Simulated Circuit Executors based on privymint.compact contract logic
function simulateCreateFraction(params: {
  metadataHash: string;
  totalShares: number;
  sharePrice: number;
  creatorCommitment: number;
}): { offeringId: number; metadataHash: string; totalShares: number; sharePrice: number } {
  const { metadataHash, totalShares, sharePrice, creatorCommitment } = params;

  if (totalShares <= 0) {
    throw new Error('PrivyMint: Total shares must be greater than zero');
  }
  if (sharePrice <= 0) {
    throw new Error('PrivyMint: Share price must be greater than zero');
  }
  if (creatorCommitment <= 0) {
    throw new Error('PrivyMint: Invalid creator identity commitment');
  }

  return {
    offeringId: 0,
    metadataHash,
    totalShares,
    sharePrice,
  };
}

function simulateBuyShares(params: {
  offeringId: number;
  sharesToBuy: number;
  status: number;
  totalShares: number;
  soldShares: number;
  investorCommitment: number;
  sessionNonce: number;
}): { newSoldShares: number; newStatus: number } {
  const { sharesToBuy, status, totalShares, soldShares, investorCommitment, sessionNonce } = params;

  if (sharesToBuy <= 0) {
    throw new Error('PrivyMint: Must purchase at least one share');
  }
  if (status !== 0) {
    throw new Error('PrivyMint: Offering is not active');
  }

  const available = totalShares - soldShares;
  if (sharesToBuy > available) {
    throw new Error('PrivyMint: Insufficient shares available in offering');
  }
  if (investorCommitment <= 0) {
    throw new Error('PrivyMint: Invalid investor identity');
  }
  if (sessionNonce <= 0) {
    throw new Error('PrivyMint: Invalid session nonce');
  }

  const newSoldShares = soldShares + sharesToBuy;
  const newStatus = newSoldShares === totalShares ? 1 : 0;
  return { newSoldShares, newStatus };
}

function simulateSellShares(params: {
  offeringId: number;
  sharesToSell: number;
  status: number;
  userBalance: number;
  soldShares: number;
  sessionNonce: number;
}): { newSoldShares: number; newStatus: number } {
  const { sharesToSell, status, userBalance, soldShares, sessionNonce } = params;

  if (sharesToSell <= 0) {
    throw new Error('PrivyMint: Must sell at least one share');
  }
  if (status === 2 || status === 3) {
    throw new Error('PrivyMint: Cannot sell shares — offering is cancelled or closed');
  }
  if (userBalance < sharesToSell || userBalance === 0) {
    throw new Error('PrivyMint: Insufficient share balance');
  }
  if (sessionNonce <= 0) {
    throw new Error('PrivyMint: Invalid session nonce');
  }

  const newSoldShares = soldShares - sharesToSell;
  const newStatus = status === 1 ? 0 : status;
  return { newSoldShares, newStatus };
}

function simulateTransferShares(params: {
  offeringId: number;
  sharesToTransfer: number;
  recipientCommitment: number;
  status: number;
  userBalance: number;
  sessionNonce: number;
}): boolean {
  const { sharesToTransfer, recipientCommitment, status, userBalance, sessionNonce } = params;

  if (sharesToTransfer <= 0) {
    throw new Error('PrivyMint: Must transfer at least one share');
  }
  if (recipientCommitment <= 0) {
    throw new Error('PrivyMint: Invalid recipient commitment');
  }
  if (status === 2 || status === 3) {
    throw new Error('PrivyMint: Cannot transfer shares — offering is not in a valid state');
  }
  if (userBalance < sharesToTransfer || userBalance === 0) {
    throw new Error('PrivyMint: Insufficient share balance to transfer');
  }
  if (sessionNonce <= 0) {
    throw new Error('PrivyMint: Invalid session nonce');
  }

  return true;
}

function simulateClaimOwnership(params: {
  offeringId: number;
  status: number;
  totalShares: number;
  userBalance: number;
  sessionNonce: number;
}): number {
  const { status, totalShares, userBalance, sessionNonce } = params;

  if (status !== 1) {
    throw new Error('PrivyMint: Offering must be fully sold out to claim ownership');
  }
  if (userBalance !== totalShares) {
    throw new Error('PrivyMint: Must hold all shares to claim full ownership');
  }
  if (sessionNonce <= 0) {
    throw new Error('PrivyMint: Invalid session nonce');
  }

  return 3; // Closed
}

function simulateVerifyOwnership(params: {
  offeringId: number;
  minimumShares: number;
  status: number;
  userBalance: number;
}): boolean {
  const { minimumShares, status, userBalance } = params;

  if (status === 2) {
    throw new Error('PrivyMint: Offering has been cancelled');
  }

  return userBalance >= minimumShares && userBalance > 0;
}

function simulateCancelOffering(params: {
  offeringId: number;
  status: number;
  callerCommitment: number;
  creatorCommitment: number;
}): number {
  const { status, callerCommitment, creatorCommitment } = params;

  if (status !== 0) {
    throw new Error('PrivyMint: Only active offerings can be cancelled');
  }
  if (callerCommitment !== creatorCommitment) {
    throw new Error('PrivyMint: Unauthorized — only the offering creator can cancel');
  }

  return 2; // Cancelled
}

function simulateCloseOffering(params: {
  offeringId: number;
  status: number;
  callerCommitment: number;
  creatorCommitment: number;
}): number {
  const { status, callerCommitment, creatorCommitment } = params;

  if (status !== 1) {
    throw new Error('PrivyMint: Only sold-out offerings can be closed');
  }
  if (callerCommitment !== creatorCommitment) {
    throw new Error('PrivyMint: Unauthorized — only the offering creator can close');
  }

  return 3; // Closed
}

describe('Compact ZK Circuit Suite — Circuit Logic & Assertions', () => {
  describe('1. createFraction circuit', () => {
    it('creates a new fractional offering with valid metadata, shares, and price', () => {
      const res = simulateCreateFraction({
        metadataHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        totalShares: 1000,
        sharePrice: 50,
        creatorCommitment: 987654,
      });

      expect(res.offeringId).toBe(0);
      expect(res.totalShares).toBe(1000);
      expect(res.sharePrice).toBe(50);
    });

    it('rejects creation when totalShares is 0', () => {
      expect(() =>
        simulateCreateFraction({
          metadataHash: '0x12345',
          totalShares: 0,
          sharePrice: 50,
          creatorCommitment: 987654,
        })
      ).toThrow('PrivyMint: Total shares must be greater than zero');
    });

    it('rejects creation when sharePrice is 0', () => {
      expect(() =>
        simulateCreateFraction({
          metadataHash: '0x12345',
          totalShares: 100,
          sharePrice: 0,
          creatorCommitment: 987654,
        })
      ).toThrow('PrivyMint: Share price must be greater than zero');
    });
  });

  describe('2. buyShares circuit', () => {
    it('allows buying available shares in an active offering', () => {
      const res = simulateBuyShares({
        offeringId: 0,
        sharesToBuy: 10,
        status: 0,
        totalShares: 100,
        soldShares: 20,
        investorCommitment: 111,
        sessionNonce: 999,
      });

      expect(res.newSoldShares).toBe(30);
      expect(res.newStatus).toBe(0);
    });

    it('transitions status to 1 (Sold Out) when final share is purchased', () => {
      const res = simulateBuyShares({
        offeringId: 0,
        sharesToBuy: 50,
        status: 0,
        totalShares: 100,
        soldShares: 50,
        investorCommitment: 111,
        sessionNonce: 999,
      });

      expect(res.newSoldShares).toBe(100);
      expect(res.newStatus).toBe(1); // Sold Out
    });

    it('rejects buying when shares exceed available remaining shares', () => {
      expect(() =>
        simulateBuyShares({
          offeringId: 0,
          sharesToBuy: 60,
          status: 0,
          totalShares: 100,
          soldShares: 50,
          investorCommitment: 111,
          sessionNonce: 999,
        })
      ).toThrow('PrivyMint: Insufficient shares available in offering');
    });
  });

  describe('3. sellShares circuit', () => {
    it('allows selling owned shares back to offering pool', () => {
      const res = simulateSellShares({
        offeringId: 0,
        sharesToSell: 5,
        status: 0,
        userBalance: 10,
        soldShares: 50,
        sessionNonce: 999,
      });

      expect(res.newSoldShares).toBe(45);
    });

    it('reverts sold-out status (1 -> 0) when shares are returned to market', () => {
      const res = simulateSellShares({
        offeringId: 0,
        sharesToSell: 10,
        status: 1, // Sold Out
        userBalance: 100,
        soldShares: 100,
        sessionNonce: 999,
      });

      expect(res.newSoldShares).toBe(90);
      expect(res.newStatus).toBe(0); // Re-activated
    });
  });

  describe('4. transferShares circuit', () => {
    it('transfers shares to a valid recipient commitment', () => {
      const success = simulateTransferShares({
        offeringId: 0,
        sharesToTransfer: 5,
        recipientCommitment: 222,
        status: 0,
        userBalance: 10,
        sessionNonce: 999,
      });

      expect(success).toBe(true);
    });

    it('rejects transfer when user has zero balance', () => {
      expect(() =>
        simulateTransferShares({
          offeringId: 0,
          sharesToTransfer: 5,
          recipientCommitment: 222,
          status: 0,
          userBalance: 0,
          sessionNonce: 999,
        })
      ).toThrow('PrivyMint: Insufficient share balance to transfer');
    });
  });

  describe('5. claimOwnership circuit', () => {
    it('allows 100% share holder to claim full asset ownership on sold-out offering', () => {
      const newStatus = simulateClaimOwnership({
        offeringId: 0,
        status: 1, // Sold out
        totalShares: 100,
        userBalance: 100,
        sessionNonce: 999,
      });

      expect(newStatus).toBe(3); // Closed
    });

    it('rejects ownership claim if user holds less than 100% of shares', () => {
      expect(() =>
        simulateClaimOwnership({
          offeringId: 0,
          status: 1,
          totalShares: 100,
          userBalance: 99,
          sessionNonce: 999,
        })
      ).toThrow('PrivyMint: Must hold all shares to claim full ownership');
    });
  });

  describe('6. verifyOwnership circuit', () => {
    it('verifies ownership when user holds required minimum shares threshold', () => {
      const isValid = simulateVerifyOwnership({
        offeringId: 0,
        minimumShares: 5,
        status: 0,
        userBalance: 10,
      });

      expect(isValid).toBe(true);
    });

    it('returns false when user balance is below minimum threshold', () => {
      const isValid = simulateVerifyOwnership({
        offeringId: 0,
        minimumShares: 20,
        status: 0,
        userBalance: 10,
      });

      expect(isValid).toBe(false);
    });
  });

  describe('7. cancelOffering circuit', () => {
    it('allows creator to cancel an active offering', () => {
      const newStatus = simulateCancelOffering({
        offeringId: 0,
        status: 0,
        callerCommitment: 777,
        creatorCommitment: 777,
      });

      expect(newStatus).toBe(2); // Cancelled
    });

    it('rejects cancellation from unauthorized non-creator', () => {
      expect(() =>
        simulateCancelOffering({
          offeringId: 0,
          status: 0,
          callerCommitment: 888,
          creatorCommitment: 777,
        })
      ).toThrow('PrivyMint: Unauthorized — only the offering creator can cancel');
    });
  });

  describe('8. closeOffering circuit', () => {
    it('allows creator to close a sold-out offering', () => {
      const newStatus = simulateCloseOffering({
        offeringId: 0,
        status: 1, // Sold out
        callerCommitment: 777,
        creatorCommitment: 777,
      });

      expect(newStatus).toBe(3); // Closed
    });

    it('rejects closing active offerings that are not sold out', () => {
      expect(() =>
        simulateCloseOffering({
          offeringId: 0,
          status: 0, // Active
          callerCommitment: 777,
          creatorCommitment: 777,
        })
      ).toThrow('PrivyMint: Only sold-out offerings can be closed');
    });
  });
});
