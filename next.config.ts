import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
      },
    ],
  },
  // AWS deployment optimization
  output: 'standalone',
  experimental: {
    esmExternals: 'loose'
  },
  // Ensure environment variables are available at build time
  env: {
    NEXT_PUBLIC_TMDB_API_TOKEN: process.env.NEXT_PUBLIC_TMDB_API_TOKEN,
  },
};

export default nextConfig;
