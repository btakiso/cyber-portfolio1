/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
                    },
                ],
            },
        ];
    },
    images: {
        domains: ['localhost', 'api.bereketakiso.com', 'strapi-s3-bucket1.s3.us-east-1.amazonaws.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.bereketakiso.com',
                port: '',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'strapi-s3-bucket1.s3.us-east-1.amazonaws.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

module.exports = nextConfig;