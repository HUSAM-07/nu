import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  // Avoid using Turbopack which has CSS parsing issues
};

export default nextConfig;
