/**
 * PrivyMint — Utility & Design System Helpers
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes with clsx */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a DUST amount into a human-readable Midnight tDUST string */
export function formatDust(dust: number): string {
  const tDust = dust / 1_000_000;
  if (tDust >= 1_000_000) return `${(tDust / 1_000_000).toFixed(2)}M tDUST`;
  if (tDust >= 1_000)     return `${(tDust / 1_000).toFixed(2)}K tDUST`;
  return `${tDust.toFixed(2)} tDUST`;
}

/** Format a percentage with one decimal point */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/** Format a large number with abbreviations */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

/** Truncate a hex/address string to the first/last N chars */
export function truncateHex(hex: string, chars = 6): string {
  if (hex.length <= chars * 2 + 2) return hex;
  return `${hex.slice(0, chars)}…${hex.slice(-chars)}`;
}

/** Map numeric offering status to a typed string */
export function mapOfferingStatus(status: number): 'active' | 'sold_out' | 'cancelled' | 'closed' {
  const map: Record<number, 'active' | 'sold_out' | 'cancelled' | 'closed'> = {
    0: 'active',
    1: 'sold_out',
    2: 'cancelled',
    3: 'closed',
  };
  return map[status] ?? 'cancelled';
}

/** Generate a deterministic color from a string (for avatar backgrounds) */
export function stringToColor(str: string): string {
  const colors = [
    '#8b5cf6', '#7c3aed', '#6d28d9', '#a78bfa',
    '#4565f9', '#2d44ee', '#6a8fff', '#c4b5fd',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length] ?? '#8b5cf6';
}

/** Sleep for a given number of ms (for simulating async ZK proof generation) */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
