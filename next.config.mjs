/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "steady-otter-860.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
