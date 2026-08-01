'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Wallet, ChevronDown, Award, Menu, X, Zap, ShieldCheck } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useWitnessStore } from '@/context/WitnessStore';
import { PreprodBanner } from '@/components/ui/PreprodBanner';
import { truncateHex } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  const { executionMode } = useWitnessStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/dashboard/investor', label: 'Investor Portal' },
    { href: '/dashboard/creator', label: 'Creator Hub' },
    { href: '/verify', label: 'ZK Verifier' },
    { href: '/analytics', label: 'AI Analytics' },
    { href: '/onboarding', label: 'Beta Program' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <PreprodBanner />
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-midnight-950/85 backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
          
          {/* Brand Logo & Tag */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <Shield className="h-4.5 w-4.5 text-white" />
              <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-midnight-950 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-brand-300 transition-colors">
                PrivyMint
              </span>
              <span className="hidden xl:inline-flex items-center gap-1 rounded-full bg-brand-500/15 border border-brand-500/30 px-2 py-0.5 text-[10px] font-semibold text-brand-300">
                Midnight ZK
              </span>
            </div>
          </Link>

          {/* Central Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section — Status & Wallet */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {executionMode === 'sandbox' ? (
              <div className="hidden md:flex items-center gap-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 px-3 py-1 text-[11px] font-semibold text-brand-300">
                <Zap className="h-3 w-3 text-brand-400" />
                <span>ZK Sandbox Mode</span>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-400">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span>Preprod Network</span>
              </div>
            )}

            {wallet.status === 'connected' ? (
              <div className="relative">
                <button
                  onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                  className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-brand-500/40 px-3.5 py-2 text-xs font-semibold text-white hover:border-brand-500 transition-all shadow-md shadow-brand-500/10"
                >
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono">{truncateHex(wallet.address ?? '', 4)}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {walletMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-white/10 bg-midnight-950/95 p-4 backdrop-blur-2xl shadow-2xl z-50 space-y-3">
                    <div className="border-b border-white/10 pb-3">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Connected Wallet</p>
                      <p className="font-mono text-xs font-bold text-white truncate mt-1">
                        {wallet.address}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Identity Commitment:</span>
                        <span className="font-mono text-brand-400 font-semibold">{truncateHex(wallet.commitment ?? '', 4)}</span>
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
                className="btn-primary py-2 px-4 text-xs font-semibold rounded-xl"
              >
                <Wallet className="h-3.5 w-3.5" />
                <span className="whitespace-nowrap">
                  {wallet.status === 'connecting' ? 'Connecting...' : 'Connect Wallet'}
                </span>
              </button>
            )}
          </div>

          {/* Mobile Drawer Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-white/10 bg-midnight-950/95 p-5 backdrop-blur-2xl space-y-4">
            <nav className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    isActive(link.href) ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs text-emerald-400 justify-center">
                <Award className="h-3.5 w-3.5" />
                <span>Preprod Devnet</span>
              </div>

              {wallet.status === 'connected' ? (
                <button
                  onClick={() => {
                    disconnectWallet();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full btn-secondary text-xs text-red-400 border-red-500/30 justify-center"
                >
                  Disconnect ({truncateHex(wallet.address ?? '', 4)})
                </button>
              ) : (
                <button
                  onClick={() => {
                    connectWallet();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full btn-primary text-xs justify-center"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Connect Wallet</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
