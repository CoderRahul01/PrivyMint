'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Wallet, Sparkles, Menu, X, CheckCircle2, ChevronDown, Award } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { truncateHex } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/dashboard/investor', label: 'Investor Portal' },
    { href: '/dashboard/creator', label: 'Creator Hub' },
    { href: '/verify', label: 'ZK Verifier' },
    { href: '/onboarding', label: 'Beta Program' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-midnight-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <Shield className="h-5 w-5 text-white" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-midnight-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">PrivyMint</span>
              <span className="badge-privacy text-[10px] py-0.5 px-2">Midnight ZK</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Private NFT Fractionalization</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                isActive(link.href)
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section — Wallet Connection & Moonshots Badge */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs text-emerald-400">
            <Award className="h-3.5 w-3.5" />
            <span>Preprod Devnet</span>
          </div>

          {wallet.status === 'connected' ? (
            <div className="relative">
              <button
                onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                className="flex items-center gap-2 rounded-xl bg-slate-900 border border-brand-500/30 px-4 py-2.5 text-sm font-medium text-white hover:border-brand-500/60 transition-all duration-200 shadow-md shadow-brand-500/10"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{truncateHex(wallet.address ?? '', 5)}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {walletMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-midnight-950/95 p-4 backdrop-blur-2xl shadow-2xl z-50">
                  <div className="mb-3 border-b border-white/10 pb-3">
                    <p className="text-xs font-semibold text-slate-400">Connected Wallet</p>
                    <p className="font-mono text-xs font-semibold text-white truncate mt-1">
                      {wallet.address}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                      <span>Identity Commitment:</span>
                      <span className="font-mono text-brand-400">{truncateHex(wallet.commitment ?? '', 4)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      disconnectWallet();
                      setWalletMenuOpen(false);
                    }}
                    className="w-full rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-400 transition-colors"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={wallet.status === 'connecting'}
              className="btn-primary"
            >
              <Wallet className="h-4 w-4" />
              <span>{wallet.status === 'connecting' ? 'Connecting ZK Wallet...' : 'Connect Wallet'}</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-midnight-950/95 p-6 backdrop-blur-2xl space-y-4">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive(link.href) ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-white/10">
            {wallet.status === 'connected' ? (
              <button
                onClick={() => {
                  disconnectWallet();
                  setMobileMenuOpen(false);
                }}
                className="w-full btn-secondary text-red-400 border-red-500/30 justify-center"
              >
                Disconnect ({truncateHex(wallet.address ?? '', 4)})
              </button>
            ) : (
              <button
                onClick={() => {
                  connectWallet();
                  setMobileMenuOpen(false);
                }}
                className="w-full btn-primary justify-center"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
