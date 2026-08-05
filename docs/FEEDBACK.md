# User Feedback & Iteration Log — Level 5 & 6

## Feedback Collection Method
Feedback collected via built-in PrivyMint Beta Feedback Modal (`/onboarding`), Telegram developer groups, and direct tester interviews on Midnight Preview.

## Raw Feedback Log
| # | User Category | Feedback Summary | Date | Rating |
|---|---------------|------------------|------|--------|
| 1 | UX / Visuals | Glassmorphic dark mode looks premium; ZK shield animation makes privacy feel tangible. | 2026-07-22 | 5/5 |
| 2 | Privacy | Loved the standalone ZK Verifier tool (`/verify`) — clear demonstration of selective disclosure without wallet exposure. | 2026-07-23 | 5/5 |
| 3 | Feature Request | Add direct share price calculation in DUST & tADA in the buy form. | 2026-07-24 | 4/5 |

## What We Heard (Themes)
1. **Clear ZK Proof Feedback**: Users wanted visible loading spinners while client-side ZK proofs are being generated.
2. **Selective Disclosure Utility**: Proving $\ge N$ share co-ownership without revealing wallet address is the standout killer feature.

## What We Changed
| Change | Reason | Commit |
|--------|--------|--------|
| Added dynamic share calculator | User request to preview total DUST valuation before buying | `0c1083b` |
| Built standalone ZK Verifier page | Allow third-party verifiers to validate proofs | `0c1083b` |
