# PrivyMint — Architecture Memory & Tradeoff Decisions

## Naming & Standards
- Project Name: **PrivyMint**
- Contract Identifier: `privymint.compact`
- Directory Structure: Monorepo with `apps/web`, `apps/api`, `contracts/`, `docs/`, `.github/`
- Contract Address Placeholder: `<YOUR_DEPLOYED_CONTRACT_ADDRESS>`

## Key Technical Decisions
1. **Compact Contract Design**:
   - Built with Midnight Compact 0.5.1 compiler compatibility.
   - Uses struct types for `OfferingState`, `FractionToken`, `PrivateHoldingWitness`, and `ProofVerification`.
   - Enforces strict invariant checks on total share supply vs purchase commitments.
2. **State Management**:
   - `Zustand` for active wallet state, session management, and UI settings.
   - `React Query` (`@tanstack/react-query`) for fetching offering listings, API state, and cached portfolio queries.
3. **Frontend Aesthetics**:
   - Dark mode first, glassmorphism UI with custom purple (`#8B5CF6`) and midnight blue (`#0F172A`) color palettes.
   - Framer Motion micro-animations for card hovers, modal transitions, and ZK proof generation indicators.
   - Modern Google Font (`Inter` / `Outfit`).
4. **Backend API (`apps/api`)**:
   - Express server providing REST endpoints for off-chain metadata indexing, feedback collection, analytics aggregation, and SDK helper utilities.
   - Zod validation schemas for all incoming API requests.
