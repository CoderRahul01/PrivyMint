# PrivyMint — Product Proposal (Midnight Builder Challenge)

## What is the product, and who uses it?

PrivyMint is a privacy-first NFT fractionalization protocol engineered natively for the Midnight Network blockchain. It enables owners of high-value digital assets (e.g. blue-chip generative art, rare gaming items, metaverse real estate, and tokenized real-world assets) to lock their assets into zero-knowledge smart contracts and issue tradable fractional shares. 

**Target Users:**
- **Institutional & High-Net-Worth Collectors**: Who want to fractionalize or acquire shares without exposing their portfolio balance or capital strategy to public mempools.
- **DAOs & Treasuries**: Seeking co-ownership of premium assets without revealing internal vote stakes or fund balances.
- **Retail Investors**: Who want affordable exposure to million-dollar assets without sacrificing transaction privacy or being front-run by MEV bots.

---

## Why Midnight specifically?

On transparent EVM blockchains (such as Ethereum or Polygon), every fractional share purchase, wallet address, and balance is 100% public. This creates severe friction for whales, institutions, and privacy-conscious users:

1. **Wealth Exposure**: Anyone can audit a user's wallet address and total fractional holdings.
2. **Front-Running & Copy-Trading**: Large acquisitions trigger MEV bots and front-running.
3. **All-or-Nothing Disclosure**: Proving co-ownership requires linking a public wallet address.

Midnight specifically enables PrivyMint to solve this via **Compact Zero-Knowledge Circuits**. Public ledger state is limited strictly to aggregate metadata and total supply, while all buyer identities, individual share balances, and transaction witnesses remain locked in local private witness state. Investors use `disclose()` selectively to prove holding $\ge N$ shares without exposing their wallet address or total portfolio.

---

## Data Model & Privacy Boundary

| Data Point | Type | Disclosed To | Description |
|------------|------|--------------|-------------|
| NFT IPFS Metadata CID | Public Ledger | Everyone | Content identifier for the underlying digital asset |
| Total Fractional Shares | Public Ledger | Everyone | Total share supply issued for the offering |
| Unit Share Price (DUST) | Public Ledger | Everyone | Fixed price per share |
| Aggregate Sold Shares | Public Ledger | Everyone | Total shares claimed across all investors |
| Offering Status | Public Ledger | Everyone | Listing state (Active, Sold Out, Cancelled, Closed) |
| Creator Commitment | Public Ledger | Everyone | Cryptographic commitment hash of creator identity |
| Investor Wallet Address | Private Witness | No One | Cryptographically hidden local witness key |
| Individual Share Balance | Private Witness | No One | Maintained in local ZK state |
| Capital Invested | Private Witness | No One | Kept private from on-chain observers |
| Selective Ownership Proof | Disclose Circuit | Verifier Only | Proves $\ge N$ shares held without revealing address |

---

## Mainnet Feasibility

PrivyMint is fully realistic for Midnight Mainnet launch (Level 6 Supermoon):
1. **Mathematical Simplicity**: The Compact contract (`privymint.compact`) uses lightweight field arithmetic and zero-knowledge assertions, minimizing proof computation time in client browsers.
2. **Off-Chain Metadata Indexer**: The accompanying Express API handles fast UI searching and filtering without cluttering the on-chain ledger.
3. **Interoperable Wallet Standard**: Built on top of Midnight wallet provider abstractions with Lace wallet integration support.
