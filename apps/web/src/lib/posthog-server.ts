/**
 * PrivyMint Web — Server-Side PostHog
 *
 * Ported from apps/api/src/services/posthog.ts so server-side capture
 * (share_purchased, share_transferred, telemetry events) runs in the same
 * Vercel deployment as the rest of the app.
 */

import { PostHog } from 'posthog-node';

const apiKey = process.env.POSTHOG_API_KEY ?? process.env.NEXT_PUBLIC_POSTHOG_KEY ?? 'phc_privymint_default_key';
const host = process.env.POSTHOG_HOST ?? process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

export const posthogServerClient = new PostHog(apiKey, {
  host,
  flushInterval: 1000,
  flushAt: 1,
});

export function trackServerEvent(
  distinctId: string,
  eventName: string,
  properties: Record<string, any> = {}
) {
  try {
    posthogServerClient.capture({
      distinctId,
      event: eventName,
      properties: {
        ...properties,
        $lib: 'privymint-server-node',
        environment: process.env.NODE_ENV ?? 'development',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.warn('PostHog server event capture warning:', err);
  }
}
