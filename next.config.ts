import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, context) => {
    // Add database directory to ignored watch paths
    config.watchOptions = {
      ignored: [
        '/node_modules/**',
        '/.next/**',
        '/data/**',
      ]
    };
    return config;
  },
};

export default nextConfig;