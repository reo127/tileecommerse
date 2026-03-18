import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "assets-news.housing.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
    ],
    formats: ['image/webp'],
    // Allow all external images for blog posts
    unoptimized: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb', // Allow up to 25MB for slider videos/images
    },
  },
  reactStrictMode: true,
};

export default nextConfig;
