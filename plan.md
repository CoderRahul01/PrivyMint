# PrivyMint — Master Product Plan & Roadmap

## Versioning & Expansion Strategy (Moonshot Program Readiness)

### v0.1 — Core Privacy Fractional NFT Platform (Current Objective)
- [x] Compact Smart Contract (`contracts/privymint.compact`) with ZK transition circuits and private witnesses.
- [x] Full-Stack Architecture (Next.js `apps/web` + Express API `apps/api`).
- [x] Midnight Wallet Integration hook & state abstraction.
- [x] NFT Fractionalization flow (Lock NFT, define shares, set price, publish offering).
- [x] Privacy-First Marketplace (Browse, filter, purchase private shares with ZK proof generation).
- [x] Investor Dashboard (Private portfolio view, ownership verification via `disclose()`, transaction history).
- [x] Creator Dashboard (Offering management, analytics, total raised, holder stats).
- [x] Feedback & Analytics Engine (Preview user feedback modal, telemetry hooks).
- [x] CI/CD Pipeline & Automated Testing Suite.
- [x] Complete System Documentation (`docs/` and `README.md`).

### v0.2 — Secondary Share Trading (Architecture Prepared / Hidden Hooks)
- Peer-to-peer private fraction trading order book.
- Zero-knowledge matching engine for buyer/seller privacy.

### v0.3 — DAO Governance & Co-Owner Voting (Architecture Prepared / Hidden Hooks)
- Fractional share voting rights for locked NFT actions (e.g., selling underlying NFT).
- Private snapshot voting using Midnight ZK proofs.

### v0.4 — Private Auctions & Sealed Bidding (Architecture Prepared / Hidden Hooks)
- Sealed-bid auctions for fractional drops.
- Proof of funds verification without revealing liquid wallet balance.

### v0.5 — Private Royalty & Yield Distribution (Architecture Prepared / Hidden Hooks)
- Private distribution of rental yields or commercial licensing fees to fraction holders.

### v1.0 — Mainnet Production Release & Cross-Chain Bridges
- Full mainnet deployment, audited contracts, multi-wallet support, cross-chain NFT collateral bridge.
