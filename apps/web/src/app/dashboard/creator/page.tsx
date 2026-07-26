'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Plus,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Layers,
  FileText,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createOffering } from '@/lib/api-client';
import { useWallet } from '@/context/WalletContext';

export default function CreatorDashboardPage() {
  const { wallet, connectWallet } = useWallet();

  const [step, setStep] = useState<1 | 2>(1);
  const [isCreating, setIsCreating] = useState(false);
  const [successOfferingId, setSuccessOfferingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [collection, setCollection] = useState('');
  const [category, setCategory] = useState<any>('art');
  const [totalShares, setTotalShares] = useState<number>(10000);
  const [sharePrice, setSharePrice] = useState<number>(50000);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wallet.status !== 'connected') {
      connectWallet();
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // 1. Simulate Compact createFraction() smart contract execution
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Generate a mock 32-byte hex CID
      const simulatedHash = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      // 2. Index metadata on API
      const res = await createOffering({
        metadataHash: simulatedHash,
        metadata: {
          name,
          description,
          imageUrl: imageUrl || 'https://picsum.photos/seed/custom/800/800',
          collection: collection || 'Independent Collection',
          category,
          tags: ['fractionalized', 'privymint'],
          attributes: [{ trait_type: 'Creator Asset', value: 'Original' }],
        },
        totalShares,
        sharePrice,
        creatorPublicKey: wallet.commitment ?? 'simulated-creator',
      });

      setSuccessOfferingId(res.offeringId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to launch fractional drop');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-xs text-brand-400 font-semibold uppercase tracking-wider">
          <PieChart className="h-4 w-4" />
          <span>Creator Offering Hub</span>
        </div>
        <h1 className="heading-xl text-white">Fractionalize Digital Asset</h1>
        <p className="text-sm text-slate-400">
          Lock an NFT or digital asset into a Midnight Compact smart contract, define fractional share parameters, and publish to the privacy marketplace.
        </p>
      </div>

      {successOfferingId ? (
        <GlassCard className="p-12 text-center space-y-4 border-emerald-500/30">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="heading-lg text-white">Fractional Offering Live!</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Your asset has been locked into the Compact contract and published to the PrivyMint marketplace with Midnight ZK privacy protections.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <a href={`/marketplace/${successOfferingId}`} className="btn-primary text-xs px-6">
              View Published Offering
            </a>
            <button
              onClick={() => {
                setSuccessOfferingId(null);
                setName('');
                setDescription('');
                setImageUrl('');
              }}
              className="btn-secondary text-xs px-6"
            >
              Fractionalize Another Asset
            </button>
          </div>
        </GlassCard>
      ) : (
        <form onSubmit={handleCreate} className="space-y-8">
          <GlassCard className="p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-400" />
              <span>Asset Metadata & Shares Setup</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Asset Name */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Asset Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Genesis Cryptopunk #4820"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              {/* Collection Name */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Collection Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rare Collectibles Guild"
                  value={collection}
                  onChange={(e) => setCollection(e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              {/* Category Select */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Asset Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="input-field text-sm bg-midnight-900"
                >
                  <option value="art">Generative Fine Art</option>
                  <option value="gaming">Gaming Item / Asset</option>
                  <option value="virtual_worlds">Metaverse & RWA</option>
                  <option value="collectibles">Digital Collectibles</option>
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Image Asset URL (IPFS or HTTPS)</label>
                <input
                  type="url"
                  placeholder="https://picsum.photos/seed/asset/800/800"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-300 mb-1.5">Asset Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed description of the underlying NFT asset, provenance, and fractional co-ownership terms..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field text-sm resize-none"
                />
              </div>

              {/* Total Shares */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Total Fractional Shares *</label>
                <input
                  type="number"
                  min={100}
                  max={1000000}
                  value={totalShares}
                  onChange={(e) => setTotalShares(parseInt(e.target.value) || 1000)}
                  className="input-field text-sm font-semibold"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Min 100 — Max 1,000,000 shares</span>
              </div>

              {/* Price Per Share */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Price Per Share (in DUST) *</label>
                <input
                  type="number"
                  min={1000}
                  value={sharePrice}
                  onChange={(e) => setSharePrice(parseInt(e.target.value) || 50000)}
                  className="input-field text-sm font-semibold"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">50,000 DUST = 0.05 tDUST / tADA</span>
              </div>
            </div>

            {/* Total Valuation Card */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">Total Calculated Asset Valuation:</span>
                <span className="text-xl font-bold text-brand-300">
                  {((totalShares * sharePrice) / 1_000_000).toLocaleString()} tDUST / tADA
                </span>
              </div>
              <div className="text-right">
                <span className="badge-privacy text-[10px]">Midnight Compact Circuit</span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Launch Button */}
            <button
              type="submit"
              disabled={isCreating}
              className="w-full btn-primary justify-center py-3.5 text-sm"
            >
              {isCreating ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Executing ZK Circuit `createFraction()`...</span>
                </>
              ) : wallet.status !== 'connected' ? (
                <span>Connect Wallet to Fractionalize</span>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Lock NFT & Launch Fractional Drop</span>
                </>
              )}
            </button>
          </GlassCard>
        </form>
      )}
    </div>
  );
}
