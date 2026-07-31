'use client';

/**
 * PrivyMint — Midnight Wallet Context
 *
 * Provides wallet connection state management using Zustand.
 * Abstracts the Midnight SDK wallet API behind a clean React context
 * so components don't depend on the SDK directly.
 *
 * In a full Midnight integration, the `connectWallet()` function would call:
 *   window.midnight.enable() — injected by the Midnight browser extension wallet
 * For Preprod v0.1, we simulate the wallet state with a realistic flow.
 */

import React, { createContext, useContext, useCallback } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { sleep } from '@/lib/utils';
import { trackOnboardingEvent } from '@/lib/api-client';
import type { WalletState, WalletConnectionStatus } from '@/types/api';

// ─────────────────────────────────────────────────────────────────────────────
// WALLET STORE (Zustand — persisted across page refreshes)
// ─────────────────────────────────────────────────────────────────────────────

interface WalletStore extends WalletState {
  sessionId: string;
  setStatus: (status: WalletConnectionStatus) => void;
  setConnected: (address: string, commitment: string, network: string) => void;
  setError: (error: string) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      status: 'disconnected',
      sessionId: typeof window !== 'undefined'
        ? (localStorage.getItem('privymint_session_id') ?? (() => {
            const id = crypto.randomUUID();
            localStorage.setItem('privymint_session_id', id);
            return id;
          })())
        : 'ssr-session',
      setStatus: (status) => set({ status }),
      setConnected: (address, commitment, network) =>
        set({ status: 'connected', address, commitment, network, error: undefined }),
      setError: (error) => set({ status: 'error', error }),
      disconnect: () =>
        set({ status: 'disconnected', address: undefined, commitment: undefined, network: undefined, error: undefined }),
    }),
    {
      name: 'privymint-wallet',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : ({} as Storage)
      ),
      partialize: (state) => ({
        status: state.status,
        address: state.address,
        commitment: state.commitment,
        network: state.network,
        sessionId: state.sessionId,
      }),
    }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// WALLET CONTEXT — Actions exposed to components
// ─────────────────────────────────────────────────────────────────────────────

interface WalletContextValue {
  wallet: WalletStore;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  generateOwnershipProof: (offeringId: string, minimumShares: number) => Promise<string>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const wallet = useWalletStore();

  /**
   * Connect to the Midnight Wallet.
   *
   * Production: Calls window.midnight.enable() from the Midnight browser extension.
   * Preprod v0.1: Simulates the connection flow with a realistic async delay.
   */
  const connectWallet = useCallback(async () => {
    wallet.setStatus('connecting');

    try {
      // Check if real Midnight / Lace browser extension connector is available
      const win = typeof window !== 'undefined' ? (window as any) : null;
      const laceMidnight = win?.midnight ?? win?.cardano?.midnight;

      if (laceMidnight && typeof laceMidnight.enable === 'function') {
        try {
          const provider = await laceMidnight.enable();
          const address = typeof provider.getAddress === 'function' ? await provider.getAddress() : `mn1prvy${Math.random().toString(36).slice(2, 10)}`;
          const commitment = typeof provider.getCommitment === 'function' ? await provider.getCommitment() : Array.from(crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, '0')).join('');
          const network = provider.network ?? process.env.NEXT_PUBLIC_NETWORK ?? 'preprod';

          wallet.setConnected(address, commitment, network);

          await trackOnboardingEvent({
            eventType: 'wallet_connected',
            sessionId: wallet.sessionId,
            walletCommitment: commitment,
            timestamp: new Date().toISOString(),
          });
          return;
        } catch (laceErr) {
          console.warn('Lace wallet connection prompt cancelled or rejected, falling back to devnet simulation:', laceErr);
        }
      }

      // Preprod simulation handshake (fallback when Lace extension is not installed)
      await sleep(1200);

      const simulatedAddress = `mn1prvy${Math.random().toString(36).slice(2, 10)}`;
      const simulatedCommitment = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      const network = process.env.NEXT_PUBLIC_NETWORK ?? 'preprod';

      wallet.setConnected(simulatedAddress, simulatedCommitment, network);

      // Track wallet connection for Level 5 analytics
      await trackOnboardingEvent({
        eventType: 'wallet_connected',
        sessionId: wallet.sessionId,
        walletCommitment: simulatedCommitment,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      wallet.setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    }
  }, [wallet]);

  const disconnectWallet = useCallback(() => {
    wallet.disconnect();
  }, [wallet]);

  /**
   * Generate a Midnight zero-knowledge ownership proof.
   *
   * Production: Calls Midnight SDK to generate a ZK proof locally (client-side)
   * using the wallet's private witness and the contract's verifyOwnership circuit.
   *
   * Preprod v0.1: Simulates proof generation with a realistic processing delay.
   */
  const generateOwnershipProof = useCallback(
    async (offeringId: string, minimumShares: number): Promise<string> => {
      if (wallet.status !== 'connected') {
        throw new Error('Wallet must be connected to generate ownership proof');
      }

      // Simulate ZK proof computation delay (real proofs take 2-10 seconds)
      await sleep(2500);

      // In production Midnight SDK integration:
      // const proof = await midnight.circuit.verifyOwnership(offeringId, minimumShares);
      // return proof.toBase64();

      // Preprod simulation — return a dummy proof bytes string
      const mockProof = Array.from(crypto.getRandomValues(new Uint8Array(64)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      return mockProof;
    },
    [wallet.status]
  );

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, disconnectWallet, generateOwnershipProof }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error('useWallet must be used inside <WalletProvider>');
  }
  return ctx;
}
