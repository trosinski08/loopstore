/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'loopstore.s3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'loopstore-media.s3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'backend',
        port: '8443',
        pathname: '/media/**',
      },
    ],
  },
  async rewrites() {
    // This rewrite directs requests made to the Next.js server (e.g., from Server Components or client-side calls
    // that hit the Next.js server for /api/* paths) to the backend service.
    return [
      {
        source: '/api/:path*',
        // The destination should be the address of the backend service reachable from the Next.js container.
        destination: 'http://backend:8000/api/:path*',
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;