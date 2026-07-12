import type { NextConfig } from "next";

// Env-driven so local dev + the Railway (standalone) build are unchanged, and
// only the GitHub Pages build opts into static export under a sub-path.
const isExport = process.env.NEXT_OUTPUT === "export";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: isExport ? "export" : "standalone",
  basePath: basePath || undefined,
  trailingSlash: isExport,
  images: { unoptimized: true },
};

export default nextConfig;
