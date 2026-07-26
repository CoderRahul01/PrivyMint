'use client';

/**
 * PrivyMint — Global Providers
 *
 * Wraps the application with all required React providers:
 * - TanStack React Query for server state
 * - Wallet Provider for Midnight wallet connection
 * - (Future) ThemeProvider for advanced theming
 */

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from '@/context/WalletContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,         // 30 seconds
            refetchOnWindowFocus: false,
            retry: 2,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        {children}
      </WalletProvider>
    </QueryClientProvider>
  );
}
