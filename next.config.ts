import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", 
  images: {
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  allowedDevOrigins: ["192.168.1.100"],
};

export default nextConfig;