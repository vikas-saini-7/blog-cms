import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "www.shareicon.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "dcqvlggtmjzpytvfbohq.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
