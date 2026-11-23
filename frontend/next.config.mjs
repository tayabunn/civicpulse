/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  transpilePackages: ['gsap', '@gsap/react'],
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com'],
  },
};

export default nextConfig;
