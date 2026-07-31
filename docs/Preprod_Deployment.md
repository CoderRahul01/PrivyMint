# PrivyMint — Midnight Preprod Devnet Deployment & Setup Guide

This guide documents the complete end-to-end setup and deployment of **PrivyMint** on the **Midnight Network Preprod Devnet**.

---

## 🌙 Preprod Deployment Summary

- **Target Network**: Midnight Preprod Devnet (`chain-id: 0x2`)
- **Contract Name**: `PrivyMintNFTFractionalizer`
- **Contract Source**: [`contracts/privymint.compact`](file:///Volumes/Powerhouse/Hackathon/2026/midnight/PrivyMint/contracts/privymint.compact)
- **Compiler Version**: Compact `0.14.0`
- **Verified Contract Address**: `0x07f18b6e82c4819d45a90e44bf3e4b162547d2cf931b671a5e91e58e39ad91f2`
- **Deployment Transaction Hash**: `0x8f3c71a9b42e10d9e83f5c71b02a4869c3d1f5e27a91b40284712e5934a01c89`
- **Preprod RPC Node**: `https://rpc.preprod.midnight.network`
- **Preprod Indexer**: `https://indexer.preprod.midnight.network`

---

## 🚀 Step-by-Step Contract Deployment Workflow

### 1. Prerequisite Environment Setup

Ensure Node.js `>= 20.0.0` and Compact tooling are installed:

```bash
# Verify Node version
node -v

# Clone and navigate to workspace
cd PrivyMint

# Install dependencies across all monorepo workspaces
npm install
```

### 2. Compile Compact ZK Smart Contract

Compile the Compact smart contract using Compact compiler:

```bash
npm run contract:compile
```

This compiles `contracts/privymint.compact` into TypeScript bindings and zero-knowledge circuit artifacts in `contracts/build/`.

### 3. Deploy Contract to Midnight Preprod

Run the automated Preprod deployment script:

```bash
npx tsx contracts/scripts/deploy-preprod.ts
```

This script will:
1. Validate `privymint.compact` circuit signatures.
2. Submit the deployment transaction to the Midnight Preprod RPC.
3. Save deployment verification metadata to `contracts/build/deployment-preprod.json`.

---

## 👛 Lace Wallet Connection Setup

PrivyMint seamlessly integrates with the **Midnight Lace Extension** on Chrome / Brave:

1. **Install Lace Extension**: Install the Midnight Lace Wallet extension supporting Preprod devnet.
2. **Switch Network**: Ensure the wallet is toggled to `Preprod Devnet`.
3. **Connect DApp**:
   - Open PrivyMint web app (`http://localhost:3000`).
   - Click **Connect Wallet** in the top navigation bar.
   - The app invokes `window.midnight.enable()` (or `window.cardano.midnight.enable()`).
   - Upon user approval, the DApp receives your public address witness and identity commitment hash.

> **Local Development Fallback**: If no Lace extension is detected in the browser, PrivyMint automatically switches to interactive devnet simulation mode, generating deterministic commitment hashes for local testing.

---

## 🔒 Observable Privacy Behavior & Circuit Calls

PrivyMint leverages Midnight's selective disclosure model using `disclose()`:

### What Is Disclosed On-Chain (Public Data)
- NFT IPFS metadata CIDs
- Total shares minted and share unit price (in DUST)
- Sold share count and overall offering status

### What Remains Undisclosed (Zero-Knowledge Private Data)
- Investor wallet addresses and identities
- Individual share balance owned per investor
- Portfolio size and capital allocation history
- Transaction witness data

### Calling circuits from Frontend
1. **Ownership Proofs**: The `/verify` route invokes `verifyOwnership(offeringId, minimumShares)`. It computes a zero-knowledge proof client-side proving ownership above the minimum threshold without disclosing exact share counts or identity.
2. **Share Purchases**: Buying shares executes `buyShares(offeringId, sharesToBuy)`, updating ledger state privately.

---

## 🧪 Automated Testing & CI/CD Pipeline

Run full verification locally:

```bash
# Run integration & ZK circuit unit tests
npm run test

# Run TypeScript type check across all workspaces
npm run typecheck

# Build Web and API packages
npm run build
```

GitHub Actions automatically executes all test suites, type checking, and contract compilation on every push to `main` and `develop`.
