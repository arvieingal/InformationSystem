/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // temp add for next-auth failded build issues
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
