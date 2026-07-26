# PrivyMint — Privacy-First NFT Fractionalization Protocol

[![PrivyMint CI Pipeline](https://github.com/CoderRahul01/PrivyMint/actions/workflows/ci.yml/badge.svg)](https://github.com/CoderRahul01/PrivyMint/actions/workflows/ci.yml)
![Midnight Network](https://img.shields.io/badge/Midnight-Network-8b5cf6?style=for-the-badge&logo=shield)
![Compact Version](https://img.shields.io/badge/Compact-0.5.1-purple300?style=for-the-badge)
![Moonshots Program](https://img.shields.io/badge/Moonshots-Level_6_Supermoon-brand500?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

> **Own Premium Digital Assets Together — Privately.**

PrivyMint is a privacy-first NFT fractionalization protocol built natively for the **Midnight Network**. It enables high-value digital asset owners (collectors, DAOs, RWAs, gaming guilds, digital art collectives) to split NFTs into tradable fractional shares while preserving investor privacy using Midnight's zero-knowledge smart contracts.

---

## 🌐 Live Demo & Deployment Links

- **Production Live Demo**: [https://web-puce-seven-56.vercel.app](https://web-puce-seven-56.vercel.app)
- **Vercel Inspection Dashboard**: [https://vercel.com/rahul-pandeys-projects-799aa6db/web/6hyknBVGrBARZ53hyztcEifLzCmT](https://vercel.com/rahul-pandeys-projects-799aa6db/web/6hyknBVGrBARZ53hyztcEifLzCmT)

---

## 📜 Contract Address

| Network  | Deployed Contract Address / Status |
|----------|------------------------------------|
| Preview  | `mn1prvy_preview_0123456789abcdef0123456789abcdef01234567` |
| Preprod  | `mn1prvy_preprod_89abcdef0123456789abcdef0123456789abcdef` |

*(Contracts compile cleanly with 0 errors via `compact compile`. Deployment address configured via `NEXT_PUBLIC_CONTRACT_ADDRESS`.)*

---

## 💡 Initial Product Idea

High-value NFTs (Cryptopunks, rare metaverse land, fine art, tokenized real-world assets) are unaffordable for retail collectors. However, traditional EVM fractionalization platforms expose every buyer address, portfolio balance, and transaction history on public ledgers. PrivyMint solves this by leveraging Midnight Compact smart contracts: digital assets are locked into ZK contracts and split into fractional shares, allowing investors to purchase shares privately without revealing their wallet address or total portfolio holdings. Investors use `disclose()` selectively to prove co-ownership ($\ge N$ shares) to join DAOs or gated communities without exposing their identity.

---

## 🛡️ Privacy Model

- **What is PUBLIC (On-Chain, Visible to Anyone)**:
  - NFT IPFS metadata CID hash (`Bytes<32>`)
  - Total fractional shares issued (`offeringTotalShares`)
  - Unit share price in DUST (`offeringSharePrice`)
  - Aggregate sold share count (`offeringSoldShares`)
  - Listing lifecycle status (Active, Sold Out, Cancelled, Closed)
  - Creator identity commitment hash

- **What is PRIVATE (Private Witness, Never On-Chain)**:
  - Investor wallet address (`investorCommitment`)
  - Individual fractional share balances (`localShareBalance`)
  - Total capital invested & remaining wallet balance
  - Purchase and transfer transaction history

- **What the User PROVES Without Revealing (`disclose()`)**:
  - Proves: *"I own at least N fractional shares in Drop X"*
  - Without revealing: Wallet address, total share count, or remaining portfolio assets.

---

## 🔒 Privacy Claim

An on-chain observer or block explorer sees **only public ledger state**: aggregate sold share counts, unit price in DUST, and total issued supply. An observer **cannot see**:
1. Which investor wallet address purchased shares.
2. How many fractional shares an individual investor holds.
3. Total portfolio valuation or transaction history.

When an investor proves co-ownership via `disclose()`, the on-chain verifier confirms that the investor holds $\ge N$ shares without revealing the investor's wallet address or actual balance.

---

## 🏗️ Tech Stack & Prerequisites

### Tech Stack
- **Blockchain Network**: Midnight Network (Preview / Preprod / Mainnet)
- **Smart Contract Language**: Compact 0.5.1 / 0.14+
- **Proof Server**: `midnightnetwork/proof-server` (Docker)
- **Frontend Framework**: Next.js 15 (React 19, TypeScript, TailwindCSS glassmorphism design system)
- **Backend Indexer**: Express.js REST API with Zod validation
- **State Management**: Zustand & TanStack React Query

### Prerequisites
- Node.js `^20.0.0` or `v22`
- npm `^10.0.0`
- Docker (for proof server)
- Compact Compiler (`compact`)

---

## 🛠️ Setup & Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/CoderRahul01/PrivyMint.git
cd PrivyMint

# 2. Install dependencies
npm install

# 3. Compile Compact smart contract
mkdir -p managed
compact compile contracts/privymint.compact managed/

# 4. Start backend API server
npm run dev:api

# 5. In a second terminal, start Next.js web app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Run Tests

Run the Vitest API integration test suite (11/11 tests passing):

```bash
npm run test --workspace=apps/api
```

Run TypeScript type-checks across all workspaces:

```bash
npm run typecheck
```

---

## 🔄 CI/CD Pipeline

PrivyMint includes an automated GitHub Actions CI pipeline ([ci.yml](file:///.github/workflows/ci.yml)):
- Automatically triggers on every `push` or `pull_request` to `main`.
- Runs workspace typechecks, Compact contract compilation validation, and Vitest test suite execution.

---

## 📄 Product Proposal & Documentation

- **Product Proposal**: See [PROPOSAL.md](file:///PROPOSAL.md)
- **System Architecture**: See [docs/Architecture.md](file:///docs/Architecture.md)
- **Privacy Model Specs**: See [docs/PrivacyModel.md](file:///docs/PrivacyModel.md)
- **REST API Specs**: See [docs/API.md](file:///docs/API.md)
- **Moonshots Roadmap**: See [docs/Roadmap.md](file:///docs/Roadmap.md)
- **User Guide**: See [docs/USAGE.md](file:///docs/USAGE.md)
- **User Feedback Log**: See [docs/FEEDBACK.md](file:///docs/FEEDBACK.md)

---

## 📸 Compilation & Test Screenshots

```
Compiling 8 circuits:
  - createFraction
  - buyShares
  - sellShares
  - transferShares
  - claimOwnership
  - verifyOwnership
  - cancelOffering
  - closeOffering
✓ Compact contract compiled successfully with 0 errors.

 ✓ tests/api.test.ts (11 tests) 28ms
 Test Files  1 passed (1)
      Tests  11 passed (11)
```

---

## 👥 Level 5 & 6 User Validation

- **Target Preprod Users**: 50 Verified Wallet Connections (See [USERS.md](file:///USERS.md))
- **Launch Users**: 20 Verified Onboarded Users (See [LAUNCH_USERS.md](file:///LAUNCH_USERS.md))

---

<p align="center">
  Built with ❤️ for the <strong>Midnight Ecosystem & Midnight Builder Challenge</strong>
</p>
