/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['localhost', 'cyber-portfolio-72310aa69f55.herokuapp.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cyber-portfolio-72310aa69f55.herokuapp.com',
          port: '',
          pathname: '/uploads/**',
        },
      ],
      unoptimized: true, // Add this line
    },
};

module.exports = nextConfig;