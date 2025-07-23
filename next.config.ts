import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3006',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.example.com',
        port: '',
        pathname: '/**',
      },
      // Add your actual storage domain here when deployed
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sekakademi-minio-6de0f3-130-61-48-47.traefik.me',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
