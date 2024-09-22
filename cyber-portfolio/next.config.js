/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['localhost'],
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '1337',
          pathname: '/uploads/**',
        },
      ],
      unoptimized: true, // Add this line
    },
};

module.exports = nextConfig;