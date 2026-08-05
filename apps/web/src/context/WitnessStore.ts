import { create } from 'zustand';
import { fetchServerHoldings, buySharesServer, transferSharesServer, fetchServerTransactions } from '@/lib/api-client';

export interface PrivateHolding {
  id?: string;
  offeringId: string;
  name: string;
  collection: string;
  imageUrl: string;
  sharesOwned: number;
  totalShares: number;
  sharePrice: number;
  purchasedAt: string;
}

export interface PrivateTransaction {
  id: string;
  type: 'BUY_SHARES' | 'TRANSFER_SHARES' | 'CLAIM_OWNERSHIP';
  offeringId: string;
  offeringName: string;
  shares: number;
  amountDust: number;
  recipientCommitment?: string;
  timestamp: string;
  zkVerified: boolean;
}

interface WitnessStoreState {
  executionMode: 'sandbox' | 'preview';
  holdings: Record<string, PrivateHolding>;
  history: PrivateTransaction[];
  loading: boolean;
  error: string | null;
  setExecutionMode: (mode: 'sandbox' | 'preview') => void;
  loadServerState: (commitment: string) => Promise<void>;
  addShares: (commitment: string, offeringId: string, sharesToBuy: number) => Promise<boolean>;
  transferShares: (senderCommitment: string, recipientCommitment: string, offeringId: string, shares: number) => Promise<boolean>;
  getHolding: (offeringId: string) => PrivateHolding | undefined;
}

export const useWitnessStore = create<WitnessStoreState>()((set, get) => ({
  executionMode: 'sandbox',
  holdings: {},
  history: [],
  loading: false,
  error: null,

  setExecutionMode: (executionMode) => set({ executionMode }),

  loadServerState: async (commitment: string) => {
    if (!commitment) return;
    set({ loading: true, error: null });
    try {
      const [serverHoldings, serverTxs] = await Promise.all([
        fetchServerHoldings(commitment),
        fetchServerTransactions(commitment),
      ]);

      const holdingsMap: Record<string, PrivateHolding> = {};
      serverHoldings.forEach((h: any) => {
        holdingsMap[h.offeringId] = {
          id: h.id,
          offeringId: h.offeringId,
          name: h.offeringName,
          collection: h.collection,
          imageUrl: h.imageUrl,
          sharesOwned: h.sharesOwned,
          totalShares: h.totalShares,
          sharePrice: h.sharePrice,
          purchasedAt: h.purchasedAt,
        };
      });

      set({
        holdings: holdingsMap,
        history: serverTxs,
        loading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to sync with server database',
        loading: false,
      });
    }
  },

  addShares: async (commitment: string, offeringId: string, sharesToBuy: number) => {
    try {
      await buySharesServer(commitment, offeringId, sharesToBuy);
      await get().loadServerState(commitment);
      return true;
    } catch (err) {
      console.error('Server share purchase error:', err);
      return false;
    }
  },

  transferShares: async (senderCommitment: string, recipientCommitment: string, offeringId: string, shares: number) => {
    try {
      await transferSharesServer(senderCommitment, recipientCommitment, offeringId, shares);
      await get().loadServerState(senderCommitment);
      return true;
    } catch (err) {
      console.error('Server share transfer error:', err);
      return false;
    }
  },

  getHolding: (offeringId: string) => get().holdings[offeringId],
}));
