import type { NextConfig } from "next";

console.log("NEXT CONFIG LOADED");

const nextConfig: NextConfig = {
  output: "export",

  basePath: "/Gleaming",
  assetPrefix: "/Gleaming/",

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
