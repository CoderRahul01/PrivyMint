'use client';

import React, { useState } from 'react';
import { Award, Users, Star, Send, CheckCircle2, Moon, Sparkles, MessageSquare } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { submitFeedback } from '@/lib/api-client';
import { useWallet } from '@/context/WalletContext';

export default function OnboardingPage() {
  const { wallet } = useWallet();

  const [category, setCategory] = useState<any>('general');
  const [rating, setRating] = useState<any>(5);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.length < 10) return;

    setSubmitting(true);
    try {
      await submitFeedback({
        category,
        rating,
        message,
        walletCommitment: wallet.commitment,
        appVersion: '0.1.0',
        page: '/onboarding',
        sessionId: wallet.sessionId,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300">
          <Moon className="h-3.5 w-3.5" />
          <span>Midnight Moonshots Level 5 Onboarding</span>
        </div>
        <h1 className="heading-xl text-white">Preview Beta Tester Program</h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Help us refine PrivyMint for the Midnight ecosystem. Test fractional drops, generate ZK proofs, and submit feedback to help us reach Supermoon Level 6.
        </p>
      </div>

      {/* Tester Onboarding Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="space-y-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400 font-bold text-sm">
            1
          </div>
          <h3 className="text-base font-bold text-white">Connect Wallet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Connect your Midnight Wallet to initiate your anonymous local session and ZK witness.
          </p>
        </GlassCard>

        <GlassCard className="space-y-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400 font-bold text-sm">
            2
          </div>
          <h3 className="text-base font-bold text-white">Explore & Buy Drops</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Purchase fractional shares in drops or launch your own fractionalized NFT listing.
          </p>
        </GlassCard>

        <GlassCard className="space-y-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400 font-bold text-sm">
            3
          </div>
          <h3 className="text-base font-bold text-white">Verify ZK Proofs</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generate selective disclosure proofs using `disclose()` and verify them on the ZK Verifier page.
          </p>
        </GlassCard>
      </div>

      {/* Feedback Submission Form */}
      <GlassCard className="p-8 space-y-6 border-brand-500/30">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Submit User Feedback</h3>
            <p className="text-xs text-slate-400">Recorded anonymously via your ZK commitment</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-bold text-white">Feedback Received!</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your feedback is crucial for evaluating Level 5 user traction. Thank you for contributing to PrivyMint!
            </p>
            <button onClick={() => setSubmitted(false)} className="btn-secondary text-xs mx-auto">
              Submit Additional Feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Feedback Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field text-xs bg-midnight-900"
                >
                  <option value="general">General Experience</option>
                  <option value="ux">UI / UX Design</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="performance">Performance</option>
                  <option value="documentation">Documentation</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Overall Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-lg transition-colors ${
                        star <= rating ? 'text-amber-400 bg-amber-500/10' : 'text-slate-600 bg-white/5'
                      }`}
                    >
                      <Star className="h-5 w-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Your Detailed Feedback *</label>
              <textarea
                rows={4}
                required
                minLength={10}
                placeholder="Share your experience testing PrivyMint's zero-knowledge NFT fractionalization..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-field text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary justify-center py-3 text-xs"
            >
              {submitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Anonymous Feedback</span>
                </>
              )}
            </button>
          </form>
        )}
      </GlassCard>
    </div>
  );
}
