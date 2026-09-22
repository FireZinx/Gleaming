import type { NextConfig } from "next";

console.log("NEXT CONFIG LOADED");

const nextConfig: NextConfig = {
   reactCompiler: true,

  output: "export",

  basePath: "/Gleaming",
  assetPrefix: "/Gleaming/",
  trailingSlash: true,

  env: {
    NEXT_PUBLIC_BASE_PATH: "/Gleaming",
  },

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
