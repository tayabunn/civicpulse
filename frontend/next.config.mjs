/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  compress: true,
  transpilePackages: ['gsap', '@gsap/react'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion', 'motion'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
};

export default nextConfig;
