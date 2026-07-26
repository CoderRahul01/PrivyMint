'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { OfferingCard } from '@/components/ui/OfferingCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { fetchOfferings } from '@/lib/api-client';
import type { PublicOffering, OfferingCategory, OfferingStatus } from '@/types/api';

export default function MarketplacePage() {
  const [offerings, setOfferings] = useState<PublicOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<OfferingCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<OfferingStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'popularity'>('newest');

  const categories: { label: string; value: OfferingCategory | 'all' }[] = [
    { label: 'All Categories', value: 'all' },
    { label: 'Generative Art', value: 'art' },
    { label: 'Gaming Assets', value: 'gaming' },
    { label: 'Metaverse & RWAs', value: 'virtual_worlds' },
    { label: 'Digital Collectibles', value: 'collectibles' },
  ];

  const loadOfferings = async () => {
    setLoading(true);
    try {
      const res = await fetchOfferings({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        search: search.length > 0 ? search : undefined,
        sortBy,
      });
      setOfferings(res.items);
    } catch (err) {
      console.error('Failed to load offerings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfferings();
  }, [selectedCategory, selectedStatus, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOfferings();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-brand-400 font-semibold uppercase tracking-wider">
          <span>Midnight ZK Marketplace</span>
        </div>
        <h1 className="heading-xl text-white">Explore Fractional Drops</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Browse fractionalized high-value NFTs. Purchase shares with complete zero-knowledge investor privacy guaranteed by Midnight smart contracts.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <GlassCard className="p-4 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search collections, NFTs, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 text-xs py-2.5"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as OfferingCategory | 'all')}
            className="input-field text-xs py-2.5 bg-midnight-900 md:w-48"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OfferingStatus | 'all')}
            className="input-field text-xs py-2.5 bg-midnight-900 md:w-36"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="sold_out">Sold Out</option>
            <option value="closed">Closed</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input-field text-xs py-2.5 bg-midnight-900 md:w-40"
          >
            <option value="newest">Newest First</option>
            <option value="popularity">Most Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          <button type="submit" className="btn-primary text-xs py-2.5 px-5 shrink-0">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter</span>
          </button>
        </form>
      </GlassCard>

      {/* Offerings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 space-y-4 animate-pulse">
              <div className="w-full aspect-square skeleton rounded-xl" />
              <div className="h-4 skeleton w-3/4 rounded" />
              <div className="h-3 skeleton w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : offerings.length === 0 ? (
        <GlassCard className="p-12 text-center space-y-4">
          <SlidersHorizontal className="h-12 w-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Fractional Offerings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No offerings matched your search criteria. Try adjusting your filters or search query.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
            className="btn-secondary text-xs mx-auto"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset Filters</span>
          </button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.map((offering) => (
            <OfferingCard key={offering.offeringId} offering={offering} />
          ))}
        </div>
      )}
    </div>
  );
}
