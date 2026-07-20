import type { NextConfig } from "next";

// Env-driven so local dev + the Railway (standalone) build are unchanged, and
// only the GitHub Pages build opts into static export under a sub-path.
const isExport = process.env.NEXT_OUTPUT === "export";
const onVercel = !!process.env.VERCEL;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Three targets: `export` for the static GitHub Pages build, `standalone` for
  // the Railway/Docker image, and Next's default on Vercel (which builds and
  // serves the app natively — `standalone` is not the supported path there).
  output: isExport ? "export" : onVercel ? undefined : "standalone",
  basePath: basePath || undefined,
  trailingSlash: isExport,
  images: { unoptimized: true },
};

export default nextConfig;
