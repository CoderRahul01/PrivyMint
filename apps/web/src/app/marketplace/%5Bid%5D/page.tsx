'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Shield,
  Lock,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  PieChart,
  Eye,
  Copy,
  Check,
  ExternalLink,
  Crown,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ZkProofModal } from '@/components/ui/ZkProofModal';
import { fetchOffering } from '@/lib/api-client';
import { useWallet } from '@/context/WalletContext';
import { useWitnessStore } from '@/context/WitnessStore';
import { formatDust, formatPercent, truncateHex } from '@/lib/utils';
import { posthog } from '@/providers/PostHogProvider';
import type { PublicOffering } from '@/types/api';

export default function OfferingDetailPage() {
  const params = useParams();
  const offeringId = params['id'] as string;
  const { wallet, connectWallet } = useWallet();
  const { addShares, getHolding } = useWitnessStore();

  const [offering, setOffering] = useState<PublicOffering | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buy form state
  const [sharesToBuy, setSharesToBuy] = useState<number>(10);
  const [isBuying, setIsBuying] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);

  // ZK Proof Modal
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const localHolding = getHolding(offeringId);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchOffering(offeringId);
        setOffering(data);
        if (typeof window !== 'undefined' && posthog) {
          posthog.capture('offering_viewed', { offeringId, offeringName: data.metadata.name });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Offering not found');
      } finally {
        setLoading(false);
      }
    }
    if (offeringId) load();
  }, [offeringId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
        <div className="h-8 skeleton w-64 mx-auto rounded" />
        <div className="h-96 skeleton w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !offering) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Offering Not Found</h2>
        <p className="text-xs text-slate-400">{error ?? 'The requested fractional offering does not exist.'}</p>
        <Link href="/marketplace" className="btn-secondary text-xs inline-flex mx-auto mt-4">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const totalCostDust = sharesToBuy * offering.sharePrice;

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wallet.status !== 'connected' || !wallet.commitment) {
      connectWallet();
      return;
    }

    setIsBuying(true);
    setBuySuccess(false);

    try {
      // Execute server-persisted share purchase & ZK witness updates
      const ok = await addShares(wallet.commitment, offering.offeringId, sharesToBuy);

      if (ok) {
        setOffering((prev) =>
          prev
            ? {
                ...prev,
                soldShares: prev.soldShares + sharesToBuy,
                availableShares: Math.max(0, prev.availableShares - sharesToBuy),
                soldPercentage: Math.min(100, ((prev.soldShares + sharesToBuy) / prev.totalShares) * 100),
              }
            : prev
        );

        if (typeof window !== 'undefined' && posthog) {
          posthog.capture('share_purchased', {
            offeringId: offering.offeringId,
            sharesToBuy,
            totalCostDust,
          });
        }

        setBuySuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBuying(false);
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(offering.metadataHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation */}
      <Link href="/marketplace" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Marketplace</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column — Asset Preview & Metadata (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-0 overflow-hidden rounded-2xl">
            <div className="relative aspect-square w-full bg-midnight-900">
              <Image
                src={offering.metadata.imageUrl}
                alt={offering.metadata.name}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4">
                <span className="badge-privacy">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Midnight ZK Protected</span>
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider">
                  {offering.metadata.collection}
                </span>
                <h1 className="text-2xl font-bold text-white mt-1">{offering.metadata.name}</h1>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{offering.metadata.description}</p>

              {/* IPFS Metadata Hash */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>IPFS Metadata CID Hash:</span>
                  <button onClick={handleCopyHash} className="flex items-center gap-1 text-brand-400 hover:text-brand-300">
                    {copiedHash ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="font-mono text-[11px] text-slate-300 truncate">{offering.metadataHash}</p>
              </div>

              {/* Attributes Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300">NFT Traits & Attributes</h4>
                <div className="grid grid-cols-2 gap-2">
                  {offering.metadata.attributes.map((attr, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                      <span className="text-[10px] text-slate-400 uppercase block">{attr.trait_type}</span>
                      <span className="font-bold text-brand-300">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column — Purchase & ZK Privacy Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* User Server Witness Balance Card */}
          {localHolding && localHolding.sharesOwned > 0 && (
            <GlassCard className="p-4 border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Your Private Holdings (Server DB Synced):</span>
                <span className="badge-active py-0.5 px-2 text-[10px]">Server DB Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-emerald-400">
                  {localHolding.sharesOwned.toLocaleString()} shares owned
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  ({((localHolding.sharesOwned / offering.totalShares) * 100).toFixed(1)}% ownership)
                </span>
              </div>
            </GlassCard>
          )}

          {/* Sales Progress Card */}
          <GlassCard className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Total Valuation</span>
                <p className="text-2xl font-bold text-white">{formatDust(offering.marketCapDust)}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Unit Share Price</span>
                <p className="text-xl font-bold text-brand-300">{formatDust(offering.sharePrice)}</p>
              </div>
            </div>

            {/* Sales Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Share Sales Progress</span>
                <span className="text-emerald-400 font-bold">{formatPercent(offering.soldPercentage)} Sold</span>
              </div>
              <div className="progress-bar h-3">
                <div className="progress-fill" style={{ width: `${Math.min(100, offering.soldPercentage)}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{offering.soldShares.toLocaleString()} shares claimed</span>
                <span>{offering.availableShares.toLocaleString()} remaining</span>
              </div>
            </div>

            {/* Purchase Calculator Form */}
            <form onSubmit={handleBuy} className="space-y-4 pt-4 border-t border-white/10">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Shares to Purchase</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, offering.availableShares)}
                    value={sharesToBuy}
                    onChange={(e) => setSharesToBuy(Math.max(1, parseInt(e.target.value) || 1))}
                    className="input-field text-sm font-semibold flex-1"
                    disabled={isBuying || offering.availableShares === 0}
                  />
                  <div className="flex gap-1">
                    {[10, 50, 100].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setSharesToBuy(Math.min(offering.availableShares, count))}
                        className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-medium hover:bg-white/10 text-slate-300"
                        disabled={offering.availableShares === 0}
                      >
                        +{count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Selected Shares:</span>
                  <span className="font-semibold text-white">{sharesToBuy.toLocaleString()} shares</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Price per Share:</span>
                  <span className="font-semibold text-white">{formatDust(offering.sharePrice)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 font-bold text-sm">
                  <span className="text-white">Total Investment:</span>
                  <span className="text-brand-300">{formatDust(totalCostDust)}</span>
                </div>
              </div>

              {buySuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Transaction confirmed & saved to Server Database!</span>
                  </div>
                  <Link
                    href="/dashboard/investor"
                    className="btn-secondary py-1.5 px-3 text-[11px] inline-flex items-center gap-1 text-white mt-1"
                  >
                    <span>View in Investor Portal</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              )}

              {/* Buy Button */}
              <button
                type="submit"
                disabled={isBuying || offering.availableShares === 0}
                className="w-full btn-primary justify-center py-3.5 text-sm"
              >
                {isBuying ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span>Executing ZK Circuit `buyShares()`...</span>
                  </>
                ) : wallet.status !== 'connected' ? (
                  <span>Connect Midnight Wallet to Buy</span>
                ) : offering.availableShares === 0 ? (
                  <span>Offering Sold Out</span>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    <span>Buy Fractional Shares Privately</span>
                  </>
                )}
              </button>
            </form>
          </GlassCard>

          {/* Privacy Guarantees & ZK Proof Trigger */}
          <GlassCard className="space-y-4 border-brand-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-brand-400" />
                <h3 className="text-base font-bold text-white">Selective Ownership Disclosure</h3>
              </div>
              <span className="badge-privacy text-[10px]">Midnight Compact Circuit</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Want to prove you co-own this asset to join a DAO or access private discord channels? Generate a zero-knowledge proof using `disclose()`.
            </p>

            <button
              onClick={() => setProofModalOpen(true)}
              className="w-full btn-secondary justify-center py-3 text-xs"
            >
              <Eye className="h-4 w-4" />
              <span>Generate ZK Ownership Proof</span>
            </button>
          </GlassCard>
        </div>
      </div>

      {/* ZK Proof Modal */}
      <ZkProofModal
        offering={offering}
        isOpen={proofModalOpen}
        onClose={() => setProofModalOpen(false)}
      />
    </div>
  );
}
