import type { NextConfig } from "next";

console.log("NEXT CONFIG LOADED");

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    "http://192.168.0.0:3000",
    "http://localhost:3000",
  ],
};

export default nextConfig;
