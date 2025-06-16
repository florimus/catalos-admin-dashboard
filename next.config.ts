import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    domains: ['4kwallpapers.com', 'static8.depositphotos.com', 'i.ibb.co'],
  },
};

export default nextConfig;
