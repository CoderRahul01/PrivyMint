'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Github, Twitter, ExternalLink, Moon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-midnight-950/90 text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">PrivyMint</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Own premium digital assets together — privately. Built natively on Midnight Network using Compact Zero-Knowledge smart contracts.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/marketplace" className="hover:text-brand-400 transition-colors">
                  Browse Marketplace
                </Link>
              </li>
              <li>
                <Link href="/dashboard/investor" className="hover:text-brand-400 transition-colors">
                  Investor Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/creator" className="hover:text-brand-400 transition-colors">
                  Creator Hub
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-brand-400 transition-colors">
                  ZK Proof Verifier
                </Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Midnight Ecosystem</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://midnight.network"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-brand-400 transition-colors"
                >
                  <span>Midnight Network</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://docs.midnight.network"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-brand-400 transition-colors"
                >
                  <span>Compact Language Specs</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-brand-400 transition-colors">
                  Moonshots Program (Level 1-6)
                </Link>
              </li>
            </ul>
          </div>

          {/* Moonshots Level Banner */}
          <div className="space-y-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-300">
              <Moon className="h-4 w-4 text-brand-400" />
              <span>Midnight Moonshots Builder</span>
            </div>
            <p className="text-xs text-slate-400">
              Built for New Moon to Full: Monthly Moonshots program on Midnight. Supermoon Level 6 production architecture ready.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PrivyMint Protocol. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Midnight Preprod Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
