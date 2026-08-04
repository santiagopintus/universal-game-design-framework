import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Set by the GitHub Actions workflow when deploying to a GitHub Pages project site
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  // Static HTML export for GitHub Pages (no Node.js server available at runtime)
  output: 'export',
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,

  // Enable compression for all text-based responses
  compress: true,

  // Image optimization
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // Enable React strict mode
  reactStrictMode: true,
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
