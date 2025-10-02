import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  compiler: {
    // Remove console.* in production except errors and warnings
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  experimental: {
    // Reduce bundle size by optimizing per-icon imports
    optimizePackageImports: ["lucide-react", "clsx", "class-variance-authority"],
  },
  async headers() {
    return [
      {
        // Cache static assets from /public aggressively
        source: "/:all*(webp|png|jpg|jpeg|svg|gif|ico|css|js|woff2|ttf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
