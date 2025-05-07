import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable tree shaking and dead code elimination in production
  swcMinify: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    // Add trusted domains if needed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Add strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize output for Vercel
  poweredByHeader: false,
  
  // Improve production builds
  productionBrowserSourceMaps: false,
};

export default nextConfig;
