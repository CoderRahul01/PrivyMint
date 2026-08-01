'use client';

import React, { useState } from 'react';
import { Shield, Send, CheckCircle2, AlertTriangle, Sparkles, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useWallet } from '@/context/WalletContext';
import { useWitnessStore, type PrivateHolding } from '@/context/WitnessStore';

interface TransferModalProps {
  holding: PrivateHolding | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransferModal({ holding, isOpen, onClose }: TransferModalProps) {
  const { wallet } = useWallet();
  const { transferShares } = useWitnessStore();

  const [sharesToTransfer, setSharesToTransfer] = useState(1);
  const [recipientCommitment, setRecipientCommitment] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !holding) return null;

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.commitment) {
      setError('Please connect your Midnight wallet first.');
      return;
    }

    if (!recipientCommitment.trim() || recipientCommitment.length < 6) {
      setError('Please enter a valid Midnight ZK Identity Commitment Hash.');
      return;
    }

    if (sharesToTransfer > holding.sharesOwned || sharesToTransfer <= 0) {
      setError(`Shares to transfer must be between 1 and ${holding.sharesOwned}.`);
      return;
    }

    setTransferring(true);
    setError(null);
    setSuccess(false);

    try {
      const ok = await transferShares(
        wallet.commitment,
        recipientCommitment.trim(),
        holding.offeringId,
        sharesToTransfer
      );

      if (ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2200);
      } else {
        setError('Failed to transfer shares. Check server response.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer circuit execution failed');
    } finally {
      setTransferring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg">
        <GlassCard className="p-6 space-y-6 border-brand-500/40 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Transfer Shares Privately</h3>
                <p className="text-xs text-slate-400">Compact ZK Circuit `transferShares()`</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Holding Context */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
            <span className="text-[10px] text-brand-300 font-semibold uppercase">{holding.collection}</span>
            <p className="font-bold text-white text-sm">{holding.name}</p>
            <p className="text-slate-400">
              Your Available Balance: <strong className="text-emerald-400">{holding.sharesOwned.toLocaleString()} shares</strong>
            </p>
          </div>

          {success ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Private Transfer Complete!</h4>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                {sharesToTransfer} shares transferred to recipient commitment on Server Database without exposing identity on-chain.
              </p>
            </div>
          ) : (
            <form onSubmit={handleTransfer} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Recipient Identity Commitment Hash *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0x8f3c71a9b42e10d9e83f5c71b02a4869c3d1f5e..."
                  value={recipientCommitment}
                  onChange={(e) => setRecipientCommitment(e.target.value)}
                  className="input-field font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Number of Shares to Transfer *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={holding.sharesOwned}
                    value={sharesToTransfer}
                    onChange={(e) => setSharesToTransfer(Math.max(1, parseInt(e.target.value) || 1))}
                    className="input-field text-sm font-semibold flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setSharesToTransfer(holding.sharesOwned)}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 text-brand-300"
                  >
                    Max ({holding.sharesOwned})
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-brand-300">
                  <Shield className="h-3.5 w-3.5" />
                  <span>ZK Witness Guarantee</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  The on-chain contract updates only aggregate balances. On-chain observers cannot see who transferred shares or to whom.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={transferring}
                className="w-full btn-primary justify-center py-3 text-xs"
              >
                {transferring ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span>Executing ZK Circuit `transferShares()`...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Execute Confidential Transfer</span>
                  </>
                )}
              </button>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
