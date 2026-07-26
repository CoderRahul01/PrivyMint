# PrivyMint REST API Specification

Base URL: `http://localhost:3001` (Development) / `https://api.privymint.io` (Production)

---

## Endpoints Summary

### System Health
- `GET /health` — Check server status, version, and Midnight network configuration.

### Offerings Indexer
- `GET /api/offerings` — List fractional offerings with filtering, searching, sorting, and pagination.
- `GET /api/offerings/:id` — Retrieve detailed metadata for a specific offering.
- `POST /api/offerings` — Register a newly created fractional offering.

### Zero-Knowledge Proofs
- `GET /api/proofs/challenge` — Generate an anti-replay session challenge nonce.
- `POST /api/proofs/verify` — Structurally verify a Midnight ZK ownership proof.

### Moonshots Level 5 Feedback & Analytics
- `POST /api/feedback` — Submit anonymous user feedback.
- `POST /api/feedback/onboarding` — Log onboarding milestones.
- `GET /api/feedback/analytics` — Retrieve aggregate platform statistics.

---

## Detailed Endpoint Specs

### `GET /api/offerings`

**Query Parameters:**
- `category` (optional): `art | gaming | collectibles | virtual_worlds`
- `status` (optional): `active | sold_out | cancelled | closed`
- `minPrice` (optional): Minimum share price in DUST
- `maxPrice` (optional): Maximum share price in DUST
- `search` (optional): Search string for title, collection, or description
- `sortBy` (optional): `newest | price_asc | price_desc | popularity | sold_percentage`
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 12): Items per page

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "offeringId": "550e8400-e29b-41d4-a716-446655440001",
        "metadataHash": "a3f8b2c1d4e5f6a7...",
        "metadata": {
          "name": "Celestial Apex #001",
          "collection": "Celestial Apex",
          "category": "art"
        },
        "totalShares": 10000,
        "sharePrice": 50000,
        "soldShares": 3420,
        "status": "active"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 12,
    "hasMore": false
  },
  "timestamp": "2026-07-27T00:00:00.000Z"
}
```
