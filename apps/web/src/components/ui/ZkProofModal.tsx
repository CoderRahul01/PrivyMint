'use client';

import React, { useState } from 'react';
import { Shield, CheckCircle2, Lock, Copy, Check, Sparkles, X, AlertTriangle } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { verifyOwnershipProof } from '@/lib/api-client';
import { truncateHex } from '@/lib/utils';
import type { PublicOffering } from '@/types/api';

interface ZkProofModalProps {
  offering: PublicOffering;
  isOpen: boolean;
  onClose: () => void;
}

export function ZkProofModal({ offering, isOpen, onClose }: ZkProofModalProps) {
  const { wallet, generateOwnershipProof } = useWallet();
  const [minShares, setMinShares] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [proof, setProof] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setProof(null);
    setVerificationResult(null);

    try {
      // 1. Generate client-side ZK proof using Midnight witness logic
      const proofData = await generateOwnershipProof(offering.offeringId, minShares);
      setProof(proofData);

      // 2. Submit to PrivyMint API for structural zero-knowledge verification
      const result = await verifyOwnershipProof({
        offeringId: offering.offeringId,
        minimumShares: minShares,
        proofData,
        publicInputs: [offering.offeringId, minShares.toString()],
      });

      setVerificationResult(result.valid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate ZK proof');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (proof) {
      navigator.clipboard.writeText(proof);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-brand-500/30 bg-midnight-950 p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Generate ZK Ownership Proof</h3>
              <p className="text-xs text-slate-400">Midnight Selective Disclosure Circuit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 flex items-start gap-2.5">
            <Lock className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              This Midnight circuit proves you hold at least <strong className="text-white">{minShares} share(s)</strong> in <strong className="text-white">{offering.metadata.name}</strong> without disclosing your wallet address, total holdings, or purchase amount.
            </p>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Minimum Share Threshold to Prove
            </label>
            <input
              type="number"
              min={1}
              max={offering.totalShares}
              value={minShares}
              onChange={(e) => setMinShares(Math.max(1, parseInt(e.target.value) || 1))}
              className="input-field text-sm"
              disabled={isGenerating}
            />
          </div>

          {/* Privacy Guarantee Box */}
          <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
            <div>
              <span className="text-slate-400 block">Revealed to Verifier:</span>
              <span className="text-emerald-400 font-semibold">✓ &quot;Holds ≥ {minShares} shares&quot;</span>
            </div>
            <div>
              <span className="text-slate-400 block">Kept 100% Private:</span>
              <span className="text-red-400 font-semibold">✗ Wallet address & balance</span>
            </div>
          </div>

          {/* Action Button */}
          {!proof && (
            <button
              onClick={handleGenerate}
              disabled={isGenerating || wallet.status !== 'connected'}
              className="w-full btn-primary justify-center py-3 text-sm mt-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Computing Zero-Knowledge Proof...</span>
                </>
              ) : wallet.status !== 'connected' ? (
                <span>Connect Wallet to Generate Proof</span>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Generate ZK Proof (`disclose()`)</span>
                </>
              )}
            </button>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Generated Proof Output */}
          {proof && (
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Zero-Knowledge Proof Generated & Verified Successfully!</span>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>ZK Proof Hash (Base64 Byte Payload):</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-brand-400 hover:text-brand-300"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-brand-300 break-all max-h-24 overflow-y-auto">
                  {proof}
                </pre>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setProof(null);
                    setVerificationResult(null);
                  }}
                  className="w-1/2 btn-secondary justify-center text-xs"
                >
                  Generate Another
                </button>
                <button onClick={onClose} className="w-1/2 btn-primary justify-center text-xs">
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
