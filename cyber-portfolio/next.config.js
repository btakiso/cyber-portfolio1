/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: `
                            default-src 'self';
                            script-src 'self' 'unsafe-eval' 'unsafe-inline';
                            style-src 'self' 'unsafe-inline';
                            img-src 'self' data: blob:;
                            font-src 'self';
                            object-src 'none';
                            base-uri 'self';
                            form-action 'self';
                            frame-ancestors 'none';
                            frame-src 'self' https://www.youtube.com;
                            connect-src 'self' https://api.bereketakiso.com https://bereketakiso.com https://www.bereketakiso.com https://cyber-portfolio-72310aa69f55.herokuapp.com;
                            upgrade-insecure-requests;
                        `.replace(/\s{2,}/g, ' ').trim()
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
    experimental: {
    },
};

module.exports = nextConfig;