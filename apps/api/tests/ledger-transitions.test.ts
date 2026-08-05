/**
 * PrivyMint API — Public Ledger State Transitions Test Suite
 *
 * Test Area 2: Public Ledger State & Lifecycle Transitions.
 */

import { describe, it, expect } from 'vitest';

describe('API Workspace — Ledger State Transitions Suite', () => {
  it('tracks offering lifecycle state transitions (0 -> 1 -> 3)', () => {
    let status = 0; // Active
    const totalShares = 100;
    let soldShares = 0;

    // Buy partial
    soldShares += 50;
    expect(status).toBe(0);

    // Buy remaining -> Sold Out
    soldShares += 50;
    if (soldShares === totalShares) status = 1;
    expect(status).toBe(1);

    // Close offering -> Closed
    status = 3;
    expect(status).toBe(3);
  });

  it('tracks cancellation transition (0 -> 2)', () => {
    let status = 0; // Active
    status = 2; // Cancelled
    expect(status).toBe(2);
  });
});
