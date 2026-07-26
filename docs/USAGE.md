# How to Use PrivyMint — User Guide

Welcome to **PrivyMint**, the privacy-first NFT fractionalization platform on Midnight Network!

## What You Need
1. **Midnight Lace Wallet** or Preprod Browser Extension.
2. **Preprod tADA / tDUST tokens** (available via Midnight Testnet Faucet).

---

## Step-by-Step User Guide

### 1. Connect Your Wallet
- Click **Connect Wallet** in the top right corner of the navbar.
- PrivyMint will connect your wallet and generate your anonymous local identity commitment (`mn1prvy...`).

### 2. Explore Fractional Drops
- Navigate to the [Marketplace](https://web-puce-seven-56.vercel.app/marketplace).
- Filter by category (Generative Art, Gaming, Virtual Worlds, Collectibles) or status (Active, Sold Out).

### 3. Purchase Shares Privately
- Click on any active drop (e.g., *Celestial Apex #001*).
- Select the number of shares to purchase.
- Click **Buy Fractional Shares Privately**.
- Your browser generates a zero-knowledge proof locally, updates the on-chain sold supply, and records your shares in your private local witness.

### 4. Prove Ownership Without Revealing Your Address (`disclose()`)
- Open the asset detail page or click **Generate ZK Ownership Proof**.
- Specify the minimum shares to prove (e.g. $\ge 10$ shares).
- Copy the generated ZK proof byte payload.
- Paste the proof into the [ZK Proof Verifier](https://web-puce-seven-56.vercel.app/verify) to validate co-ownership without revealing your identity.

---

## What Gets Proved (and What Stays Private)

| What Anyone On-Chain Sees | What Remains 100% Private to You |
|---------------------------|----------------------------------|
| Total NFT share supply | Your wallet address |
| Unit price per share | Your total share holdings |
| Aggregate sold shares | Your total capital spent |
| Public IPFS metadata CID | Your transaction history |
