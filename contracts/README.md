# PrivyMint Smart Contracts

This directory contains the Midnight Compact smart contracts for the PrivyMint platform.

## Contract Files

| File | Description |
|------|-------------|
| `privymint.compact` | Core fractionalization contract with ZK privacy circuits |

## Privacy Model

The contract follows a strict public/private data separation:

### Public Ledger State (on-chain, visible to all)
- `offeringCount` — Total number of fractional offerings created
- `offeringMetadataHash` — IPFS CID hash identifying the underlying NFT
- `offeringTotalShares` — Total share supply per offering
- `offeringSharePrice` — Unit price per share in DUST
- `offeringSoldShares` — Aggregate shares sold (no buyer identity recorded)
- `offeringStatus` — Offering lifecycle status (Active / Sold Out / Cancelled / Closed)
- `offeringCreatorCommitment` — ZK commitment binding creator without revealing raw address

### Private Witness State (local only, never on-chain)
- `localShareBalance` — Investor's private fractional share balance
- `sessionNonce` — Anti-replay unique session identifier
- `investorCommitment` — Investor identity commitment (ZK hash of wallet key)
- `creatorCommitment` — Creator authorization commitment

## Circuit Functions

| Circuit | Access | Description |
|---------|--------|-------------|
| `createFraction()` | Creator | Fractionalize an NFT into tradeable shares |
| `buyShares()` | Any | Purchase shares with ZK investor privacy |
| `sellShares()` | Shareholder | Return shares to protocol pool |
| `transferShares()` | Shareholder | P2P private share transfer via commitment |
| `claimOwnership()` | Shareholder (100%) | Consolidate all shares and claim underlying NFT |
| `verifyOwnership()` | Any | Generate proof of minimum share ownership |
| `cancelOffering()` | Creator only | Cancel an active offering |
| `closeOffering()` | Creator only | Finalize a sold-out offering |

## Compilation

```bash
# Verify contract syntax (does NOT deploy)
compact compile contracts/privymint.compact

# Full build with circuit artifacts
compact build contracts/privymint.compact
```

## Deployment

> **⚠️ Manual deployment only.** The contract is NOT automatically deployed.
>
> When ready for Preprod or Mainnet deployment, run:
> ```bash
> compact deploy contracts/privymint.compact --network preprod
> ```
> Then update `CONTRACT_ADDRESS=<YOUR_DEPLOYED_CONTRACT_ADDRESS>` in `.env`.

## Security Considerations

1. **Replay Attack Prevention**: All state-modifying circuits require a unique `sessionNonce` from the wallet.
2. **Creator Authorization**: Offering management circuits verify creator identity via ZK commitment comparison — raw wallet addresses are never stored.
3. **Balance Invariants**: Share allocation strictly enforces `sold ≤ total` via arithmetic assertions.
4. **No Private Data Leakage**: Investor identity, share balance, and capital invested are exclusively in `witness` declarations and never touch public ledger storage.
