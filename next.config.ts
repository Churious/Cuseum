import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exhibits point at arbitrary URLs on the open web, so images are rendered
  // directly instead of through next/image. See README ("Design notes").
  reactStrictMode: true,
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
