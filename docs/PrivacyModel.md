# PrivyMint — Midnight Zero-Knowledge Privacy Model

## Why Privacy is the Product

Traditional NFT marketplaces force investors into a binary choice: participate publicly or don't participate at all. This discourages institutional funds, collectors, DAOs, and high-net-worth individuals who cannot risk exposing their portfolio composition, wealth, or trading strategies.

PrivyMint leverages Midnight's domain-specific language **Compact** to separate public ledger data from private witness state.

---

## Public Ledger State vs. Private Witness State

| Data Field | Public / Private | Storage Location | Exposure Risk |
|------------|------------------|------------------|---------------|
| NFT IPFS Metadata Hash | **PUBLIC** | On-chain ledger map | Low (Generic CID) |
| Total Shares Minted | **PUBLIC** | On-chain ledger map | None |
| Unit Share Price (DUST) | **PUBLIC** | On-chain ledger map | None |
| Aggregate Sold Share Count | **PUBLIC** | On-chain ledger map | Low (Aggregate signal) |
| Offering Status | **PUBLIC** | On-chain ledger map | None |
| Investor Wallet Address | **PRIVATE** | Local Witness Only | **0% Exposure** |
| Individual Share Balance | **PRIVATE** | Local Witness Only | **0% Exposure** |
| Individual Capital Spent | **PRIVATE** | Local Witness Only | **0% Exposure** |
| Purchase & Transfer History | **PRIVATE** | Local Witness Only | **0% Exposure** |

---

## Selective Disclosure (`disclose()`)

When an investor needs to prove co-ownership of an asset (e.g., to gain entry to a gated DAO, access private Discord channels, or participate in governance), PrivyMint provides a selective disclosure circuit:

```compact
export circuit verifyOwnership(
  offeringId: Field,
  minimumShares: Uint<64>
): Boolean {
  const localBalance = localShareBalance(offeringId);
  const hasMinimum = localBalance >= minimumShares;
  return disclose(hasMinimum);
}
```

### What the Verifier Learns
- **"The prover holds at least `minimumShares` in Offering X."**

### What Remains Undisclosed
- The prover's wallet address.
- The prover's total share balance (whether they hold 10 or 10,000 shares).
- The prover's remaining portfolio.

---

## Threat Model & Security Measures

1. **Front-Running Prevention**: Because individual purchases do not expose buyer identities or share quantities on public mempools, MEV bots cannot front-run large fractional acquisitions.
2. **Replay Protection**: Every ZK proof incorporates a unique session nonce issued by the API `/api/proofs/challenge` endpoint.
3. **Over-Allocation Prevention**: The Compact circuit enforces strict state invariants (`sold + sharesToBuy <= total`) using mathematical assertions before state transitions.
