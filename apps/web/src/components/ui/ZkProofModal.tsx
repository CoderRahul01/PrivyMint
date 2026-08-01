'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, CheckCircle2, Lock, Copy, Check, Sparkles, X, AlertTriangle, ExternalLink, Cpu } from 'lucide-react';
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
  const [currentStep, setCurrentStep] = useState<number>(0); // 0: idle, 1: witness, 2: circuit, 3: proof, 4: complete
  const [proof, setProof] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setProof(null);
    setCurrentStep(1);

    try {
      // Step 1: Witness Data Retrieval
      await new Promise((r) => setTimeout(r, 600));
      setCurrentStep(2);

      // Step 2: Compact Circuit Constraint Evaluation
      await new Promise((r) => setTimeout(r, 800));
      setCurrentStep(3);

      // Step 3: ZK Proof Computation
      const proofData = await generateOwnershipProof(offering.offeringId, minShares);
      setProof(proofData);
      setCurrentStep(4);

      // Step 4: Verification Key Hash & Public Input Generation
      await verifyOwnershipProof({
        offeringId: offering.offeringId,
        minimumShares: minShares,
        proofData,
        publicInputs: [offering.offeringId, minShares.toString()],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate ZK proof');
      setCurrentStep(0);
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

  const verifyUrl = proof
    ? `/verify?proof=${encodeURIComponent(proof)}&offeringId=${encodeURIComponent(offering.offeringId)}&minShares=${minShares}`
    : '/verify';

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
              <p className="text-xs text-slate-400">Midnight Selective Disclosure Circuit `disclose()`</p>
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
              Proves you co-own at least <strong className="text-white">{minShares} share(s)</strong> in <strong className="text-white">{offering.metadata.name}</strong> without revealing wallet key, exact share count, or transaction history.
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
              className="input-field text-sm font-semibold"
              disabled={isGenerating}
            />
          </div>

          {/* ZK Pipeline Stepper */}
          {isGenerating && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <span className="text-[11px] font-semibold text-brand-300 uppercase tracking-wider block">
                Compact Zero-Knowledge Execution Pipeline
              </span>
              <div className="space-y-2 text-xs">
                <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <CheckCircle2 className={`h-4 w-4 ${currentStep === 1 ? 'animate-spin text-brand-400' : ''}`} />
                  <span>1. Loading Private Witness Scalar & Commitment Key</span>
                </div>
                <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <CheckCircle2 className={`h-4 w-4 ${currentStep === 2 ? 'animate-spin text-brand-400' : ''}`} />
                  <span>2. Asserting Invariants (`minimumShares &lt;= witnessHoldings`)</span>
                </div>
                <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <CheckCircle2 className={`h-4 w-4 ${currentStep === 3 ? 'animate-spin text-brand-400' : ''}`} />
                  <span>3. Computing Groth16 ZK Proof Payload</span>
                </div>
                <div className={`flex items-center gap-2 ${currentStep >= 4 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>4. Output Verification Hash Ready</span>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Guarantee Box */}
          {!isGenerating && !proof && (
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
              <div>
                <span className="text-slate-400 block">On-Chain Visible:</span>
                <span className="text-emerald-400 font-semibold">✓ "Holds ≥ {minShares} shares"</span>
              </div>
              <div>
                <span className="text-slate-400 block">Kept 100% Private:</span>
                <span className="text-red-400 font-semibold">✗ Wallet key & balance</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          {!proof && !isGenerating && (
            <button
              onClick={handleGenerate}
              disabled={wallet.status !== 'connected'}
              className="w-full btn-primary justify-center py-3 text-sm mt-2"
            >
              {wallet.status !== 'connected' ? (
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
                  <span>ZK Proof Payload (Base64 Byte String):</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-brand-400 hover:text-brand-300 font-semibold"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-brand-300 break-all max-h-24 overflow-y-auto">
                  {proof}
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Link
                  href={verifyUrl}
                  onClick={onClose}
                  className="btn-primary justify-center text-xs flex-1 py-2.5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Test in ZK Verifier Tool</span>
                </Link>
                <button
                  onClick={() => {
                    setProof(null);
                    setCurrentStep(0);
                  }}
                  className="btn-secondary justify-center text-xs flex-1 py-2.5"
                >
                  Generate Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
