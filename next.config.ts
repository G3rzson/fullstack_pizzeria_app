import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // bodySizeLimit is required to handle file uploads in server actions
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },

  // Configure allowed image domains for Next.js Image component
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dtxwborwl/**", // ** = minden alútvonal
      },
    ],
  },
};

export default nextConfig;
