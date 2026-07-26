import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output for containerized deployment
  output: 'standalone',
  // Image optimization domains
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'ipfs.io' },
      { protocol: 'https', hostname: '**.ipfs.nftstorage.link' },
    ],
  },
  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
    NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK ?? 'preprod',
    NEXT_PUBLIC_CONTRACT_ADDRESS:
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '<YOUR_DEPLOYED_CONTRACT_ADDRESS>',
    NEXT_PUBLIC_APP_VERSION: '0.1.0',
  },
};

export default nextConfig;
