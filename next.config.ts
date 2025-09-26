import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.danhobak.kr',
      },
    ],
  },
};

export default nextConfig;
