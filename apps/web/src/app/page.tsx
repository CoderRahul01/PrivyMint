'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  EyeOff,
  Zap,
  PieChart,
  Lock,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Users,
  Building2,
  Coins,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { OfferingCard } from '@/components/ui/OfferingCard';
import { FeedbackModal } from '@/components/ui/FeedbackModal';

export default function HomePage() {
  const [privacyTab, setPrivacyTab] = useState<'traditional' | 'privymint'>('privymint');
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Sample featured drops for landing page
  const featuredDrops = [
    {
      offeringId: '550e8400-e29b-41d4-a716-446655440001',
      metadataHash: 'a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
      metadata: {
        name: 'Celestial Apex #001',
        description: 'Rare generative art algorithmically rendered on Midnight.',
        imageUrl: 'https://picsum.photos/seed/celestial001/800/800',
        collection: 'Celestial Apex',
        category: 'art' as const,
        tags: ['generative', '1-of-1'],
        attributes: [{ trait_type: 'Rarity', value: 'Legendary' }],
      },
      totalShares: 10000,
      sharePrice: 50000,
      soldShares: 3420,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      availableShares: 6580,
      soldPercentage: 34.2,
      totalRaisedDust: 171000000,
      marketCapDust: 500000000,
    },
    {
      offeringId: '550e8400-e29b-41d4-a716-446655440002',
      metadataHash: 'b4e9f1d2a5c8e3f0b7d4a1c6e9f2b5d8a3c6f0b3d6a9c2f5b8e1d4a7c0f3b6e9',
      metadata: {
        name: 'Shadow Realm Land Parcel #0047',
        description: 'Prime metaverse real estate adjacent to trade hub.',
        imageUrl: 'https://picsum.photos/seed/shadowrealm047/800/800',
        collection: 'Shadow Realm',
        category: 'virtual_worlds' as const,
        tags: ['metaverse', 'land'],
        attributes: [{ trait_type: 'Zone', value: 'Central Hub' }],
      },
      totalShares: 5000,
      sharePrice: 120000,
      soldShares: 4890,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      availableShares: 110,
      soldPercentage: 97.8,
      totalRaisedDust: 586800000,
      marketCapDust: 600000000,
    },
    {
      offeringId: '550e8400-e29b-41d4-a716-446655440003',
      metadataHash: 'c5f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0b2',
      metadata: {
        name: 'Void Phantom — Championship Edition',
        description: 'Rarest sword in Chronicles of the Void.',
        imageUrl: 'https://picsum.photos/seed/voidphantom/800/800',
        collection: 'Chronicles of the Void',
        category: 'gaming' as const,
        tags: ['gaming', 'weapon'],
        attributes: [{ trait_type: 'Class', value: 'Legendary' }],
      },
      totalShares: 1000,
      sharePrice: 250000,
      soldShares: 1000,
      status: 'sold_out' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      availableShares: 0,
      soldPercentage: 100,
      totalRaisedDust: 250000000,
      marketCapDust: 250000000,
    },
  ];

  const moonshotsLevels = [
    { level: '🌑 Level 1', title: 'Compact & Compiler Setup', status: 'Completed' },
    { level: '🌒 Level 2', title: 'Midnight Wallet Integration', status: 'Completed' },
    { level: '🌓 Level 3', title: 'Production App & CI/CD Pipeline', status: 'Completed' },
    { level: '🌔 Level 4', title: 'Preprod MVP & Documentation', status: 'Completed' },
    { level: '🌕 Level 5', title: 'User Onboarding & Feedback Hooks', status: 'Active Beta' },
    { level: '🌝 Level 6', title: 'Mainnet Ready & Scale Architecture', status: 'Ready' },
  ];

  const faqs = [
    {
      q: 'How does PrivyMint protect investor privacy?',
      a: 'Unlike Ethereum platforms where every fraction purchase is attached to your public address, PrivyMint uses Midnight Compact Zero-Knowledge circuits. Only aggregate sold share counts are on-chain — your identity, exact holdings, and investment history remain locked in your local private witness.',
    },
    {
      q: 'Can I prove I own shares without revealing my identity?',
      a: 'Yes! PrivyMint features a selective disclosure circuit (`disclose()`). You can generate a ZK proof to verify you own at least N shares to join DAOs or gated portals without disclosing your wallet address or total portfolio balance.',
    },
    {
      q: 'What happens when all shares are sold?',
      a: 'When 100% of shares are sold, the offering marks as Sold Out. If a single collector acquires 100% of the fractional shares, they can invoke the `claimOwnership` ZK circuit to consolidate ownership and unlock the underlying asset.',
    },
    {
      q: 'Is PrivyMint deployed on Mainnet yet?',
      a: 'PrivyMint is compiled for the Midnight Preprod Network with manual deployment ready (`<YOUR_DEPLOYED_CONTRACT_ADDRESS>`). It is currently participating in the Midnight Monthly Moonshots Program.',
    },
  ];

  return (
    <div className="relative space-y-24 pb-20 overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────────────────
          HERO SECTION
      ───────────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-brand-500/20 blur-3xl -z-10 rounded-full pointer-events-none" />

        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-brand-400 animate-spin" />
          <span>Built Natively for Midnight Network</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-emerald-400">Moonshots Level 6 Production Architecture</span>
        </div>

        {/* Hero Title */}
        <h1 className="heading-hero max-w-4xl mx-auto">
          Own Premium Digital Assets Together — <span className="text-brand-400">Privately.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The privacy-first NFT fractionalization platform built on Midnight. Split high-value digital assets into tradeable shares while preserving investor identity, portfolio sizes, and capital history using zero-knowledge smart contracts.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/marketplace" className="btn-primary w-full sm:w-auto text-base py-3.5 px-8">
            <span>Explore Fractional Drops</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link href="/dashboard/creator" className="btn-secondary w-full sm:w-auto text-base py-3.5 px-8">
            <PieChart className="h-5 w-5" />
            <span>Fractionalize NFT</span>
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <GlassCard className="p-4 text-center">
            <span className="text-2xl font-bold text-white">100%</span>
            <span className="block text-xs text-slate-400 mt-1">Zero-Knowledge Private</span>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <span className="text-2xl font-bold text-brand-300">0.5.1</span>
            <span className="block text-xs text-slate-400 mt-1">Compact Compiler Verified</span>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <span className="text-2xl font-bold text-emerald-400">Preprod</span>
            <span className="block text-xs text-slate-400 mt-1">Midnight Testnet Ready</span>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <span className="text-2xl font-bold text-purple-300">Level 6</span>
            <span className="block text-xs text-slate-400 mt-1">Supermoon Architecture</span>
          </GlassCard>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          PROBLEM VS SOLUTION (INTERACTIVE SLIDER / TAB)
      ───────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <span className="badge-privacy">Paradigm Shift</span>
          <h2 className="heading-xl text-white">Why Existing Marketplaces Fail Investors</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Traditional NFT marketplaces expose wealth, wallet activity, and holdings. PrivyMint makes privacy the default product.
          </p>
        </div>

        {/* Interactive Toggle Bar */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-white/5 p-1 border border-white/10">
            <button
              onClick={() => setPrivacyTab('traditional')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                privacyTab === 'traditional'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Traditional Marketplaces (Public)
            </button>
            <button
              onClick={() => setPrivacyTab('privymint')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                privacyTab === 'privymint'
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PrivyMint on Midnight (ZK Private)
            </button>
          </div>
        </div>

        {/* Dynamic Comparison Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard className="space-y-6 border-red-500/20 bg-red-500/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400">
                <EyeOff className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Traditional NFT Fractionalization</h3>
                <p className="text-xs text-red-400 font-medium">Public Blockchain Exposure</p>
              </div>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Public Investor Identity:</strong> Anyone can track your wallet address and purchase history.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Exposed Portfolio Sizes:</strong> Whales and DAOs risk front-running and copy-trading.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>No Selective Disclosure:</strong> Proving ownership forces revealing your entire wallet balance.</span>
              </li>
            </ul>
          </GlassCard>

          <GlassCard className="space-y-6 border-brand-500/30 bg-brand-500/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">PrivyMint Zero-Knowledge Architecture</h3>
                <p className="text-xs text-brand-300 font-medium">Midnight Compact ZK Engine</p>
              </div>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Private Investor Identity:</strong> Local witness hides your wallet key behind a cryptographic commitment.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Confidential Share Holdings:</strong> Only aggregate sold supply is on-chain. Your exact holdings stay local.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Selective Proof Verification:</strong> Use `disclose()` to prove holding ≥ N shares without revealing identity.</span>
              </li>
            </ul>
          </GlassCard>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          FEATURED DROPS CAROUSEL / GRID
      ───────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="badge-active">Live Marketplace</span>
            <h2 className="heading-xl text-white mt-2">Featured Fractional Drops</h2>
          </div>
          <Link href="/marketplace" className="btn-secondary text-xs">
            <span>View All Collections</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDrops.map((drop) => (
            <OfferingCard key={drop.offeringId} offering={drop} />
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          MIDNIGHT MOONSHOTS PROGRESSION TRACKER
      ───────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto section-glow pt-12">
        <GlassCard className="p-8 space-y-8 border-brand-500/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-brand-400" />
                <h3 className="text-xl font-bold text-white">Midnight Monthly Moonshots Builder Progression</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Designed to progress seamlessly through every stage from New Moon to Supermoon Level 6.
              </p>
            </div>
            <button
              onClick={() => setFeedbackOpen(true)}
              className="btn-primary text-xs shrink-0"
            >
              <Users className="h-4 w-4" />
              <span>Submit Level 5 Feedback</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {moonshotsLevels.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand-500/40 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-brand-300">{item.level}</span>
                  <span className="badge-active py-0.5 px-2 text-[10px]">{item.status}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          FAQS SECTION
      ───────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="heading-xl text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm">Everything you need to know about PrivyMint and Midnight Zero-Knowledge technology.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {faqs.map((faq, idx) => (
            <GlassCard key={idx} className="p-6 space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-brand-400 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">{faq.a}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Level 5 Feedback Modal */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
