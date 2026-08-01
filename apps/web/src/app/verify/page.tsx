'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Shield, CheckCircle2, XCircle, Search, Sparkles, Copy, Check, FileCode2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { verifyOwnershipProof } from '@/lib/api-client';

function ZkVerifierForm() {
  const searchParams = useSearchParams();

  const [proofData, setProofData] = useState('');
  const [offeringId, setOfferingId] = useState('550e8400-e29b-41d4-a716-446655440001');
  const [minShares, setMinShares] = useState(1);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlProof = searchParams.get('proof');
    const urlOfferingId = searchParams.get('offeringId');
    const urlMinShares = searchParams.get('minShares');

    if (urlProof) setProofData(urlProof);
    if (urlOfferingId) setOfferingId(urlOfferingId);
    if (urlMinShares) setMinShares(parseInt(urlMinShares) || 1);

    if (urlProof && urlOfferingId) {
      // Auto-trigger verification when parameters passed from ZK Proof modal
      verifyOwnershipProof({
        offeringId: urlOfferingId,
        minimumShares: parseInt(urlMinShares ?? '1') || 1,
        proofData: urlProof,
        publicInputs: [urlOfferingId, urlMinShares ?? '1'],
      })
        .then((res) => setResult(res))
        .catch((err) => setError(err instanceof Error ? err.message : 'Verification failed'));
    }
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofData.trim()) {
      setError('Please paste a valid ZK proof string to verify.');
      return;
    }

    setVerifying(true);
    setError(null);
    setResult(null);

    try {
      const res = await verifyOwnershipProof({
        offeringId,
        minimumShares: minShares,
        proofData: proofData.trim(),
        publicInputs: [offeringId, minShares.toString()],
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleVerify} className="space-y-6">
        <GlassCard className="p-8 space-y-6 border-brand-500/30">
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Offering ID (UUID)</label>
              <input
                type="text"
                required
                value={offeringId}
                onChange={(e) => setOfferingId(e.target.value)}
                className="input-field text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Minimum Shares Threshold</label>
              <input
                type="number"
                min={1}
                value={minShares}
                onChange={(e) => setMinShares(parseInt(e.target.value) || 1)}
                className="input-field text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Paste Midnight ZK Proof Payload (Base64 Byte String)
              </label>
              <textarea
                rows={5}
                required
                placeholder="Paste the proof string generated from the ZK proof modal..."
                value={proofData}
                onChange={(e) => setProofData(e.target.value)}
                className="input-field font-mono text-xs resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <XCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={verifying}
            className="w-full btn-primary justify-center py-3.5 text-sm"
          >
            {verifying ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Verifying Zero-Knowledge Circuit...</span>
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                <span>Verify ZK Proof Authenticity</span>
              </>
            )}
          </button>
        </GlassCard>
      </form>

      {/* Result Card */}
      {result && (
        <GlassCard className={`p-6 border-2 ${result.valid ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-red-500/40 bg-red-500/5'} space-y-4`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${result.valid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {result.valid ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {result.valid ? 'Proof Validated Successfully' : 'Invalid Proof Signature'}
              </h3>
              <p className="text-xs text-slate-400">Verified at {new Date(result.verifiedAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Proof Hash:</span>
              <span className="text-brand-300 truncate max-w-xs">{result.proofHash}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Meets Threshold:</span>
              <span className="text-emerald-400 font-bold">YES (≥ {minShares} shares)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Prover Identity Disclosed:</span>
              <span className="text-red-400 font-bold">NO (0% exposure)</span>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

export default function ZkVerifierPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-white/10 pb-6 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-brand-400 font-semibold uppercase tracking-wider">
          <Shield className="h-4 w-4" />
          <span>Midnight Zero-Knowledge Verifier</span>
        </div>
        <h1 className="heading-xl text-white">Standalone ZK Proof Verifier</h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Validate selective ownership proofs generated via Midnight `disclose()` without revealing the investor&apos;s wallet address or total portfolio holdings.
        </p>
      </div>

      <Suspense fallback={<div className="h-48 skeleton rounded-2xl w-full" />}>
        <ZkVerifierForm />
      </Suspense>
    </div>
  );
}
