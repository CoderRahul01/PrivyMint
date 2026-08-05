'use client';

import React, { useState } from 'react';
import { MessageSquare, Star, Send, CheckCircle2, X } from 'lucide-react';
import { submitFeedback } from '@/lib/api-client';
import { useWallet } from '@/context/WalletContext';
import type { FeedbackCategory, FeedbackRating } from '@/types/api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { wallet } = useWallet();
  const [category, setCategory] = useState<FeedbackCategory>('general');
  const [rating, setRating] = useState<FeedbackRating>(5);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.length < 10) {
      setError('Feedback message must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitFeedback({
        category,
        rating,
        message,
        walletCommitment: wallet.commitment,
        appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? '0.1.0',
        page: typeof window !== 'undefined' ? window.location.pathname : '/',
        sessionId: wallet.sessionId,
      });

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-midnight-950 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Preview User Feedback</h3>
              <p className="text-xs text-slate-400">Moonshots Level 5 User Evaluation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white">Feedback Submitted!</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Thank you for helping us refine PrivyMint for the Midnight ecosystem. Your response has been recorded anonymously.
            </p>
            <button onClick={onClose} className="btn-primary text-xs mx-auto mt-4 px-6">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Category Select */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Feedback Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
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

            {/* Rating Stars */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Overall Rating</label>
              <div className="flex items-center gap-2">
                {([1, 2, 3, 4, 5] as FeedbackRating[]).map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      star <= rating ? 'text-amber-400 bg-amber-500/10' : 'text-slate-600 bg-white/5'
                    }`}
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* Message Textarea */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Your Feedback</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts on the privacy model, UI, or feature suggestions..."
                className="input-field text-xs resize-none"
              />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary justify-center py-2.5 text-xs"
            >
              {isSubmitting ? (
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
      </div>
    </div>
  );
}
