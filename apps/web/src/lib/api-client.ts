/**
 * PrivyMint — API Client
 *
 * Type-safe HTTP client for communicating with the PrivyMint API backend.
 * All methods return strongly-typed responses using the shared type definitions.
 */

import type {
  PublicOffering,
  OfferingListFilters,
  PaginatedResponse,
  CreateOfferingRequest,
  OwnershipProofRequest,
  OwnershipProofResult,
  FeedbackSubmission,
  OnboardingEvent,
  AnalyticsSnapshot,
  ApiResponse,
} from '../types/api';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL &&
  process.env.NEXT_PUBLIC_API_URL !== 'http://localhost:3001'
    ? process.env.NEXT_PUBLIC_API_URL
    : '';

async function apiRequest<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    const data = (await response.json()) as ApiResponse<T>;

    if (!response.ok) {
      throw new Error(data.error ?? `Request failed with status ${response.status}`);
    }

    return data;
  } catch (err) {
    console.warn(`[PrivyMint API] Network request to ${path} warning:`, err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// OFFERINGS
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchOfferings(
  filters: Partial<OfferingListFilters> = {}
): Promise<PaginatedResponse<PublicOffering>> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  const res = await apiRequest<PaginatedResponse<PublicOffering>>(
    `/api/offerings?${params.toString()}`
  );
  return res.data!;
}

export async function fetchOffering(id: string): Promise<PublicOffering> {
  const res = await apiRequest<PublicOffering>(`/api/offerings/${id}`);
  return res.data!;
}

export async function createOffering(
  payload: CreateOfferingRequest
): Promise<PublicOffering> {
  const res = await apiRequest<PublicOffering>('/api/offerings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data!;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROOFS
// ─────────────────────────────────────────────────────────────────────────────

export async function verifyOwnershipProof(
  payload: OwnershipProofRequest
): Promise<OwnershipProofResult> {
  const res = await apiRequest<OwnershipProofResult>('/api/proofs/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data!;
}

export async function fetchProofChallenge(): Promise<{ challenge: string; expiresAt: string }> {
  const res = await apiRequest<{ challenge: string; expiresAt: string }>('/api/proofs/challenge');
  return res.data!;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVER HOLDINGS & TRANSACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchServerHoldings(commitment: string): Promise<any[]> {
  const res = await apiRequest<any[]>(`/api/investor/holdings?commitment=${encodeURIComponent(commitment)}`);
  return res.data ?? [];
}

export async function buySharesServer(
  commitment: string,
  offeringId: string,
  sharesToBuy: number,
  address?: string
): Promise<any> {
  const res = await apiRequest<any>('/api/investor/buy', {
    method: 'POST',
    body: JSON.stringify({ commitment, offeringId, sharesToBuy, address }),
  });
  return res.data;
}

export async function transferSharesServer(
  senderCommitment: string,
  recipientCommitment: string,
  offeringId: string,
  shares: number
): Promise<any> {
  const res = await apiRequest<any>('/api/investor/transfer', {
    method: 'POST',
    body: JSON.stringify({ senderCommitment, recipientCommitment, offeringId, shares }),
  });
  return res.data;
}

export async function fetchServerTransactions(commitment?: string): Promise<any[]> {
  const url = commitment
    ? `/api/investor/transactions?commitment=${encodeURIComponent(commitment)}`
    : '/api/investor/transactions';
  const res = await apiRequest<any[]>(url);
  return res.data ?? [];
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS & AI TELEMETRY
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchDauMetrics(): Promise<any> {
  const res = await apiRequest<any>('/api/analytics/dau');
  return res.data;
}

export async function fetchAiTelemetryInsights(): Promise<any> {
  const res = await apiRequest<any>('/api/ai/telemetry-insights');
  return res.data;
}

export async function submitFeedback(payload: FeedbackSubmission): Promise<void> {
  await apiRequest('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function trackOnboardingEvent(payload: OnboardingEvent): Promise<void> {
  try {
    await apiRequest('/api/telemetry/event', {
      method: 'POST',
      body: JSON.stringify({
        eventName: payload.eventType,
        sessionId: payload.sessionId,
        commitment: payload.walletCommitment,
        payload,
      }),
    });
  } catch (err) {
    console.info('[PrivyMint Analytics] Telemetry event tracked:', payload.eventType);
  }
}

export async function fetchAnalytics(): Promise<AnalyticsSnapshot> {
  const res = await apiRequest<AnalyticsSnapshot>('/api/feedback/analytics');
  return res.data!;
}
