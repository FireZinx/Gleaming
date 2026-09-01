import type { NextConfig } from "next";

console.log("NEXT CONFIG LOADED");

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    "http://192.168.15.3:3000",
    "http://localhost:3000",
  ],
};

export default nextConfig;
