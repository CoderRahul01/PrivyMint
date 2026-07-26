'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Sparkles, Eye, PieChart } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { formatDust, formatPercent } from '@/lib/utils';
import type { PublicOffering } from '@/types/api';

interface OfferingCardProps {
  offering: PublicOffering;
}

export function OfferingCard({ offering }: OfferingCardProps) {
  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-active';
      case 'sold_out':
        return 'badge-sold-out';
      case 'cancelled':
        return 'badge-cancelled';
      case 'closed':
        return 'badge-closed';
      default:
        return 'badge-active';
    }
  };

  return (
    <GlassCard hoverEffect className="group flex flex-col justify-between overflow-hidden p-0 rounded-2xl">
      {/* Image & Header Overlay */}
      <div className="relative aspect-square w-full overflow-hidden bg-midnight-900">
        <Image
          src={offering.metadata.imageUrl}
          alt={offering.metadata.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="badge-privacy">
            <Shield className="h-3 w-3" />
            <span>ZK Protected</span>
          </span>
          <span className={getBadgeClass(offering.status)}>
            {offering.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Collection & Name Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-xs font-semibold text-brand-300 uppercase tracking-wider">
            {offering.metadata.collection}
          </p>
          <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-brand-300 transition-colors">
            {offering.metadata.name}
          </h3>
        </div>
      </div>

      {/* Card Content & Stats */}
      <div className="p-5 space-y-4">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Fractional Sales</span>
            <span className="text-brand-300 font-semibold">{formatPercent(offering.soldPercentage)}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(100, offering.soldPercentage)}%` }} />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{offering.soldShares.toLocaleString()} sold</span>
            <span>{offering.totalShares.toLocaleString()} total</span>
          </div>
        </div>

        {/* Price & Market Cap Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Share Price</span>
            <span className="font-bold text-white text-sm">{formatDust(offering.sharePrice)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Total Valuation</span>
            <span className="font-bold text-slate-200 text-sm">{formatDust(offering.marketCapDust)}</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/marketplace/${offering.offeringId}`}
          className="w-full btn-secondary text-xs justify-center py-2.5 mt-2 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-500 transition-all"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>View Fractional Drop</span>
        </Link>
      </div>
    </GlassCard>
  );
}
