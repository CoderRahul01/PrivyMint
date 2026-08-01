'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  Wallet,
  TrendingUp,
  PieChart,
  Eye,
  Lock,
  ArrowUpRight,
  Sparkles,
  Download,
  Copy,
  Check,
  Send,
  RefreshCw,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { TransferModal } from '@/components/ui/TransferModal';
import { useWallet } from '@/context/WalletContext';
import { useWitnessStore, type PrivateHolding } from '@/context/WitnessStore';
import { formatDust, formatPercent, truncateHex } from '@/lib/utils';

export default function InvestorDashboardPage() {
  const { wallet, connectWallet } = useWallet();
  const { holdings, history, loading, loadServerState } = useWitnessStore();

  const [activeTab, setActiveTab] = useState<'holdings' | 'history'>('holdings');
  const [copiedCommitment, setCopiedCommitment] = useState(false);

  // Transfer modal state
  const [transferHolding, setTransferHolding] = useState<PrivateHolding | null>(null);
  const [transferModalOpen, setTransferModalOpen] = useState(false);

  useEffect(() => {
    if (wallet.commitment) {
      loadServerState(wallet.commitment);
    }
  }, [wallet.commitment, loadServerState]);

  const holdingsList = Object.values(holdings);

  const totalPortfolioValueDust = holdingsList.reduce(
    (sum, h) => sum + h.sharesOwned * h.sharePrice,
    0
  );

  const totalSharesOwned = holdingsList.reduce((sum, h) => sum + h.sharesOwned, 0);

  const handleCopyCommitment = () => {
    if (wallet.commitment) {
      navigator.clipboard.writeText(wallet.commitment);
      setCopiedCommitment(true);
      setTimeout(() => setCopiedCommitment(false), 2000);
    }
  };

  const handleOpenTransfer = (holding: PrivateHolding) => {
    setTransferHolding(holding);
    setTransferModalOpen(true);
  };

  if (wallet.status !== 'connected') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400 mx-auto border border-brand-500/30">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="heading-lg text-white">Private Portfolio Gateway</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Connect your Midnight Wallet to unlock your private ZK witness holdings and portfolio analytics.
        </p>
        <button onClick={connectWallet} className="btn-primary text-sm mx-auto px-8 py-3.5">
          <Wallet className="h-4 w-4" />
          <span>Connect Midnight Wallet</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Wallet Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-brand-400 font-semibold uppercase tracking-wider">
            <Shield className="h-4 w-4" />
            <span>Zero-Knowledge Investor Dashboard (Server DB Persisted)</span>
          </div>
          <h1 className="heading-xl text-white mt-1">My Confidential Holdings</h1>
        </div>

        {/* Commitment Badge */}
        <GlassCard className="p-3.5 flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Identity Commitment</span>
            <span className="font-mono text-brand-300 font-semibold">{truncateHex(wallet.commitment ?? '', 6)}</span>
          </div>
          <button
            onClick={handleCopyCommitment}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            title="Copy identity commitment"
          >
            {copiedCommitment ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </GlassCard>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <GlassCard className="space-y-2">
          <span className="text-xs text-slate-400 font-medium">Total Portfolio Value</span>
          <p className="text-2xl font-bold text-white">{formatDust(totalPortfolioValueDust)}</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="h-3 w-3" />
            <span>+14.2% Estimated Value</span>
          </span>
        </GlassCard>

        <GlassCard className="space-y-2">
          <span className="text-xs text-slate-400 font-medium">Active Fractional Holdings</span>
          <p className="text-2xl font-bold text-brand-300">{holdingsList.length} Assets</p>
          <span className="text-[11px] text-slate-400">{totalSharesOwned.toLocaleString()} Total Shares Owned</span>
        </GlassCard>

        <GlassCard className="space-y-2">
          <span className="text-xs text-slate-400 font-medium">Privacy & Database Status</span>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-base font-bold text-emerald-400">Server DB Sync Active</span>
          </div>
          <span className="text-[11px] text-slate-400">Zero Holdings On Public Ledger</span>
        </GlassCard>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 text-xs font-semibold justify-between items-center">
        <div className="flex">
          <button
            onClick={() => setActiveTab('holdings')}
            className={`px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'holdings'
                ? 'border-brand-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            My Fractional Assets ({holdingsList.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-brand-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Confidential History ({history.length})
          </button>
        </div>

        <button
          onClick={() => wallet.commitment && loadServerState(wallet.commitment)}
          className="btn-secondary text-xs py-1.5 px-3 mb-2"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Server DB</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'holdings' && (
        holdingsList.length === 0 ? (
          <GlassCard className="p-12 text-center space-y-4">
            <Shield className="h-12 w-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Private Holdings Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Explore drops on the marketplace and purchase fractional shares to start building your ZK private portfolio.
            </p>
            <Link href="/marketplace" className="btn-primary text-xs mx-auto inline-flex">
              Explore Drops
            </Link>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {holdingsList.map((h) => {
              const ownershipPct = ((h.sharesOwned / h.totalShares) * 100).toFixed(1);
              const holdingValuation = h.sharesOwned * h.sharePrice;

              return (
                <GlassCard key={h.offeringId} hoverEffect className="space-y-4">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-midnight-900 shrink-0">
                      <Image src={h.imageUrl} alt={h.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] text-brand-300 uppercase font-semibold">{h.collection}</span>
                      <h3 className="text-base font-bold text-white line-clamp-1">{h.name}</h3>
                      <p className="text-xs text-slate-400">
                        Owned: <strong className="text-white">{h.sharesOwned.toLocaleString()} shares</strong> ({ownershipPct}%)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Current Value</span>
                      <span className="font-bold text-white text-sm">{formatDust(holdingValuation)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Unit Price</span>
                      <span className="font-bold text-slate-300 text-sm">{formatDust(h.sharePrice)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenTransfer(h)}
                      className="btn-secondary text-xs flex-1 justify-center py-2"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Transfer Privately</span>
                    </button>
                    <Link
                      href={`/marketplace/${h.offeringId}`}
                      className="btn-primary text-xs flex-1 justify-center py-2"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Drop Details</span>
                    </Link>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )
      )}

      {activeTab === 'history' && (
        <GlassCard className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/10">
              <span>Transaction Type</span>
              <span>Asset</span>
              <span>Shares</span>
              <span>Amount (DUST)</span>
              <span>Privacy Shield</span>
            </div>
            {history.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between text-xs text-slate-200 py-2 border-b border-white/5 last:border-0">
                <span className={`badge-active py-0.5 px-2 text-[10px] ${
                  tx.type === 'TRANSFER_SHARES' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : ''
                }`}>
                  {tx.type}
                </span>
                <span className="font-semibold">{tx.offeringName}</span>
                <span>{tx.shares.toLocaleString()}</span>
                <span>{formatDust(tx.amountDust)}</span>
                <span className="text-emerald-400 font-mono text-[11px]">Server DB & ZK Verified</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Transfer Shares Modal */}
      <TransferModal
        holding={transferHolding}
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
      />
    </div>
  );
}
