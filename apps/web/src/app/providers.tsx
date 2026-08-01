'use client';

/**
 * PrivyMint — Global Providers
 *
 * Wraps the application with required React providers:
 * - TanStack React Query for server state
 * - Wallet Provider for Midnight wallet connection
 * - PostHog Provider for analytics telemetry
 */

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from '@/context/WalletContext';
import { PostHogProvider } from '@/providers/PostHogProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            refetchOnWindowFocus: false,
            retry: 2,
          },
        },
      })
  );

  return (
    <PostHogProvider>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </QueryClientProvider>
    </PostHogProvider>
  );
}
