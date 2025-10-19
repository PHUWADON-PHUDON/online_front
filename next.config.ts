import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  async rewrites() {
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
    return [
      {
        source: '/user/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/:path*`,
      },
    ];
  },
};

export default nextConfig;
