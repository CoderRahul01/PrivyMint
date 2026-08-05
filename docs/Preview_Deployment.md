# PrivyMint — Midnight Preview Network Deployment & Setup Guide

This guide documents the complete end-to-end setup and deployment of **PrivyMint** on the **Midnight Network Preview**.

> Migrated from Preprod: the Preprod devnet and its faucet were down, so PrivyMint moved to
> Preview, the currently stable Midnight test network. The historical Preprod deployment address
> is kept in [README.md](../README.md) for reference but is no longer the active target.

---

## 🌙 Preview Deployment Summary

- **Target Network**: Midnight Preview
- **Contract Name**: `PrivyMintNFTFractionalizer`
- **Contract Source**: [`contracts/privymint.compact`](../contracts/privymint.compact)
- **Compiler Version**: Compact `0.14.0`
- **Contract Address**: set once `deploy-preview.ts` has been run against a funded Preview wallet (see below)
- **Preview RPC Node**: `https://rpc.preview.midnight.network`
- **Preview Indexer**: `https://indexer.preview.midnight.network`
- **Preview Faucet**: `https://faucet.preview.midnight.network/`

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

### 3. Fund a Preview Wallet

1. Install the Midnight **Lace** wallet extension and switch it to the **Preview** network.
2. Copy your Preview-network wallet address from Lace.
3. Paste it into the faucet at `https://faucet.preview.midnight.network/` and request tokens.

### 4. Deploy Contract to Midnight Preview

Run the deployment script, passing your funded Preview address as `CONTRACT_ADDRESS`:

```bash
CONTRACT_ADDRESS=<your-preview-wallet-address> npx tsx contracts/scripts/deploy-preview.ts
```

This script will:
1. Compile `privymint.compact`.
2. Write deployment verification metadata to `contracts/build/deployment-preview.json`.

> **Known gap**: this script does not submit a real on-chain transaction (the Preprod version had
> the same limitation) — it records deterministic metadata locally. Real submission would require
> wallet-signed transactions via `@midnight-ntwrk/midnight-js-protocol`, which isn't wired up yet.

---

## 👛 Lace Wallet Connection Setup

PrivyMint seamlessly integrates with the **Midnight Lace Extension** on Chrome / Brave:

1. **Install Lace Extension**: Install the Midnight Lace Wallet extension supporting the Preview network.
2. **Switch Network**: Ensure the wallet is toggled to `Preview`.
3. **Connect DApp**:
   - Open PrivyMint web app (`http://localhost:3000`).
   - Click **Connect Wallet** in the top navigation bar.
   - The app invokes `window.midnight.enable()` (or `window.cardano.midnight.enable()`).
   - Upon user approval, the DApp receives your public address witness and identity commitment hash.

> **Local Development Fallback**: If no Lace extension is detected in the browser, PrivyMint automatically switches to interactive ZK sandbox simulation mode, generating deterministic commitment hashes for local testing.

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
