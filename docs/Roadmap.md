# PrivyMint — Product Evolution & Moonshots Roadmap

PrivyMint is designed to evolve continuously across the **New Moon to Full: Monthly Moonshots on Midnight** program and beyond into Mainnet production.

---

## Moonshots Program Milestones (Levels 1 – 6)

### 🌑 Level 1 — Compact Toolchain & Smart Contract Setup
- [x] Configure Compact 0.5.x compilation pipeline.
- [x] Write `contracts/privymint.compact` with zero-knowledge circuits.
- [x] Implement mathematical assertions for share allocation invariants.
- [x] Compiler syntax verification with `compact compile`.

### 🌒 Level 2 — Midnight Wallet & Client Integration
- [x] Build `WalletContext` with injected window provider hooks.
- [x] Client-side ZK proof generation simulator (`generateOwnershipProof`).
- [x] Address masking and identity commitment hashing.

### 🌓 Level 3 — Production Full-Stack Application
- [x] Build Next.js 15 web app with custom glassmorphism design system.
- [x] Build Express REST API backend with Zod validation and security headers.
- [x] Configure monorepo TypeScript base config.
- [x] Implement Vitest API integration test suite.

### 🌔 Level 4 — Preprod MVP & Complete Documentation
- [x] Complete `Architecture.md`, `PrivacyModel.md`, `API.md`, and `Roadmap.md`.
- [x] Standalone ZK Verifier tool (`/verify`).
- [x] Public GitHub structure with MIT License and conventional commits.

### 🌕 Level 5 — User Onboarding & Feedback Hooks
- [x] Built-in Preprod beta feedback collection system (`/onboarding`).
- [x] Anonymous feedback API endpoint (`POST /api/feedback`).
- [x] Telemetry analytics snapshot (`GET /api/feedback/analytics`).

### 🌝 Level 6 — Supermoon Mainnet Architecture & Scale
- [x] Scale-ready REST API design with rate-limiting and modular data store.
- [x] Secondary market trading architecture hooks (v0.2).
- [x] DAO governance co-ownership voting hooks (v0.3).

---

## Post-Moonshots Product Evolution

- **v0.2 — Secondary Share Trading**: P2P private fraction order book with ZK matching.
- **v0.3 — DAO Governance**: Private snapshot voting for fraction holders.
- **v0.4 — Private Auctions**: Sealed-bid auctions for high-ticket drops.
- **v0.5 — Private Yield Distribution**: Automatic distribution of rental or commercial licensing yields.
- **v1.0 — Mainnet Production Launch**: Audited smart contracts, cross-chain bridge, and institutional onboarding.
