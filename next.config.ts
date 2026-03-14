import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // bodySizeLimit is required to handle file uploads in server actions
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
