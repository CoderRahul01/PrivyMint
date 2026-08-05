# PrivyMint — Midnight Research & Technical Discoveries

## Midnight Ecosystem Architecture

### Compact Smart Language & Zero Knowledge Model
Midnight contracts are written in **Compact**, a domain-specific language designed for privacy-preserving smart contracts.
Key Compact Concepts implemented in PrivyMint:
1. **Ledger State (`export ledger`)**: Publicly verifiable state maintained on the Midnight ledger.
   - Example: Total shares, listing status, NFT asset IPFS CID hash, public offer details.
2. **Private Witness (`witness`)**: Local private functions and state owned by the user's wallet/client.
   - Example: Private key signature witness, secret investor seed, exact share count owned by user.
3. **Disclosures (`disclose()`)**: Selective revealing of private state inside ZK proofs to prove ownership or validity without leaking full wallet identity or transaction history.
4. **Transition Functions (`export circuit`)**: Public ZK circuits that execute state transitions while verifying proof inputs from witnesses.

### Midnight Wallet & Client Integration
- **Midnight Wallet API**: Exposes injected provider (`window.midnight`) for account connection, signing ZK proofs, and transaction submission.
- **Midnight SDK (`@midnight-ntwrk/midnight-js-*`)**: Client library interfacing between the web app, local ZK proof generation, and the Midnight RPC node (Devnet/Preview).
- **Proof Generation**: ZK proofs are compiled locally on the client browser before submitting transaction payloads to the RPC node, ensuring zero sensitive data ever touches the network unencrypted.

### Security & Privacy Threat Model
1. **Data Leakage**: Ensure wallet address, balance, and purchase amounts are never stored in public ledger fields or server logs.
2. **Replay Attacks**: Include nonces and unique offering identifiers in circuit constraints.
3. **Double Claiming / Over-allocation**: Enforce strict Compact state invariants for total shares minted vs claimed fractions.
4. **Access Control**: Enforce creator authorization for offering cancellations/closures and private witness verification for share transfers.
