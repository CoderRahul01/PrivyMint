# PrivyMint — Business & Product Context

## Vision
PrivyMint is the flagship privacy-first NFT fractionalization platform designed natively for the Midnight Network ecosystem. It allows high-value digital asset owners (collectors, DAOs, RWAs, gaming projects, art collectives) to split NFTs into tradable fractional shares while leveraging Midnight's Zero-Knowledge (ZK) smart contracts to preserve investor privacy, portfolio sizes, and transaction witnesses.

## Problem Statement
High-value NFTs (e.g., Cryptopunks, rare RWAs, digital real estate, high-end art) are prohibitively expensive for individual retail collectors. Traditional Ethereum-based fractionalization solutions expose:
1. **Investor Identities**: Every wallet address interacting with the contract is public.
2. **Holding & Portfolio Sizes**: Anyone can audit an investor's exact holdings and wealth.
3. **Purchase History & Flow**: Capital movements are completely public, deterring institutional collectors, whales, and DAOs who require privacy to avoid front-running or regulatory exposure.

## The Midnight Solution
PrivyMint leverages Midnight's Compact language and ZK proving capabilities:
- **Public On-Chain Data**: Collection metadata, total fractional shares minted, asset public listing status, share unit price.
- **Private Zero-Knowledge Data**: Individual share balance, investor identity (wallet address witness), capital allocated, portfolio history, and private ownership verification proofs using `disclose()`.

## Target Users & Persona Segments
1. **High-Net-Worth Collectors & Whales**: Co-own high-ticket assets without broadcasting net worth or portfolio moves.
2. **DAO Communities & Guilds**: Pool treasury funds into fractional assets privately.
3. **Institutional NFT & RWA Investors**: Conduct confidential asset allocations with zero front-running risk.
4. **Digital Art & Gaming Collectives**: Enable fractional ownership of rare in-game items or fine art for micro-investors with full privacy.

## Ecosystem Fit & Midnight Moonshots Progression
PrivyMint is engineered from day one to progress through all 6 levels of the Midnight New Moon to Full: Monthly Moonshots program:
- **Level 1**: Compact toolchain setup, production smart contract (`privymint.compact`), compiler verification, local test setup.
- **Level 2**: Integrated web app, Midnight wallet connection provider, contract interaction hooks, state transition verification.
- **Level 3**: Production-grade full-stack application (Next.js, Express API, Zustand, React Query, TailwindCSS/shadcn), CI/CD pipeline, automated test suite, extensive documentation.
- **Level 4**: MVP deployed on Preview configuration with complete setup guides, public repository structure, launch-ready branding assets.
- **Level 5**: Built-in feedback collection system, user onboarding flow, usage analytics hooks for 50+ Preview beta users.
- **Level 6**: Mainnet deployment architecture, scale-ready APIs, secondary market hooks, DAO governance hooks, and institutional privacy features.
