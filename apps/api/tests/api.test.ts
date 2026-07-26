/**
 * PrivyMint API — Offerings Route Unit Tests
 */

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';

describe('GET /health', () => {
  it('returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
  });
});

describe('GET /api/offerings', () => {
  it('returns a paginated list of offerings', async () => {
    const res = await request(app).get('/api/offerings');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.items)).toBe(true);
    expect(typeof res.body.data.total).toBe('number');
  });

  it('filters by category', async () => {
    const res = await request(app).get('/api/offerings?category=art');
    expect(res.status).toBe(200);
    res.body.data.items.forEach((item: { metadata: { category: string } }) => {
      expect(item.metadata.category).toBe('art');
    });
  });

  it('filters by status', async () => {
    const res = await request(app).get('/api/offerings?status=active');
    expect(res.status).toBe(200);
    res.body.data.items.forEach((item: { status: string }) => {
      expect(item.status).toBe('active');
    });
  });

  it('searches by name', async () => {
    const res = await request(app).get('/api/offerings?search=Celestial');
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);
  });

  it('returns 404 for unknown offering', async () => {
    const res = await request(app).get('/api/offerings/non-existent-id');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/offerings', () => {
  it('rejects invalid metadata hash', async () => {
    const res = await request(app).post('/api/offerings').send({
      metadataHash: 'not-a-valid-hex',
      metadata: {},
      totalShares: 1000,
      sharePrice: 50000,
      creatorPublicKey: 'test',
    });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/proofs/challenge', () => {
  it('returns a fresh challenge nonce', async () => {
    const res = await request(app).get('/api/proofs/challenge');
    expect(res.status).toBe(200);
    expect(typeof res.body.data.challenge).toBe('string');
    expect(typeof res.body.data.expiresAt).toBe('string');
  });
});

describe('POST /api/feedback', () => {
  it('saves valid feedback', async () => {
    const res = await request(app).post('/api/feedback').send({
      category: 'general',
      rating: 5,
      message: 'PrivyMint is an excellent privacy-first platform for the Midnight ecosystem!',
      appVersion: '0.1.0',
      sessionId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.received).toBe(true);
  });

  it('rejects feedback with message too short', async () => {
    const res = await request(app).post('/api/feedback').send({
      category: 'bug',
      rating: 1,
      message: 'bad',
      appVersion: '0.1.0',
      sessionId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(res.status).toBe(422);
  });
});

describe('GET /api/feedback/analytics', () => {
  it('returns aggregate analytics snapshot', async () => {
    const res = await request(app).get('/api/feedback/analytics');
    expect(res.status).toBe(200);
    expect(typeof res.body.data.totalOfferings).toBe('number');
    expect(typeof res.body.data.activeOfferings).toBe('number');
  });
});
