import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without this, Next may infer the
  // root from a parent directory when multiple lockfiles exist (e.g. a git
  // worktree beside the main checkout) and pull in unrelated files.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
