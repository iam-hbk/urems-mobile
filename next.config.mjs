// import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  scope: "/app",
  register: true,
  sw: "service-worker.js",
  fallbacks: {
    // Failed page requests fallback to this.
    document: "/~offline",
  },
});

// const nextConfig: NextConfig = { /* config options here */};
// https://lbndhmuqqdswzpplnriw.supabase.co/storage/v1/s3
const nextConfig = {
  images: {
    remotePatterns: [

    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
  reactStrictMode: true,
  // exclude  net which is for server side to be bundled with client side
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false,
        child_process: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/notification-sw.js',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ]
  },
}

export default withPWA({
  ...nextConfig
});

// export default nextConfig;