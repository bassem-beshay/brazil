import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'nginx',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://nginx/api/:path*', // Proxy requests to backend via nginx
      },
      {
        source: '/media/:path*',
        destination: 'http://nginx/media/:path*', // Proxy media requests
      },
    ];
  },
};

export default nextConfig;
