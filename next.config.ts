import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build a fully static site into out/ for GitHub Pages.
  output: "export",
  // GitHub Pages can't run the image optimisation server.
  images: { unoptimized: true },
  // User site (<user>.github.io) is served from the root, so no basePath.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
