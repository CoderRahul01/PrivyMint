'use client';

import React, { useState } from 'react';
import { Moon, ShieldCheck, Zap, X, Info, CheckCircle2 } from 'lucide-react';
import { useWitnessStore } from '@/context/WitnessStore';

export function PreviewBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { executionMode, setExecutionMode } = useWitnessStore();

  if (dismissed) return null;

  return (
    <div className="relative border-b border-brand-500/30 bg-gradient-to-r from-midnight-950 via-brand-950/60 to-midnight-950 px-4 py-2 text-xs text-slate-200 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        {/* Left Side: Status Info */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 px-2.5 py-0.5 font-semibold text-brand-300 border border-brand-500/30 shrink-0">
            <Moon className="h-3 w-3 text-brand-400 animate-pulse" />
            <span>August Kickoff</span>
          </span>
          <p className="text-[11px] sm:text-xs text-slate-300">
            <strong className="text-white font-semibold">Midnight Update Notice:</strong> Now running on Preview network.{' '}
            <span className="hidden md:inline text-slate-400">
              PrivyMint includes an auto-fallback ZK sandbox to guarantee uninterrupted testing.
            </span>
          </p>
        </div>

        {/* Right Side: Mode Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 rounded-lg bg-black/40 p-1 border border-white/10 text-[11px]">
            <span className="text-slate-400 pl-1.5 font-medium">Mode:</span>
            <button
              onClick={() => setExecutionMode('sandbox')}
              className={`px-2.5 py-1 rounded font-semibold transition-all flex items-center gap-1 ${
                executionMode === 'sandbox'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Local ZK Sandbox mode guarantees zero transaction failures during Preview network downtime"
            >
              <Zap className="h-3 w-3" />
              <span>ZK Sandbox</span>
            </button>
            <button
              onClick={() => setExecutionMode('preview')}
              className={`px-2.5 py-1 rounded font-semibold transition-all flex items-center gap-1 ${
                executionMode === 'preview'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Midnight Preview network integration"
            >
              <ShieldCheck className="h-3 w-3" />
              <span>Preview RPC</span>
            </button>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            title="Dismiss announcement"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
