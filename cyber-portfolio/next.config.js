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
            // Add specific headers for favicon files
            {
                source: '/(favicon.ico|apple-touch-icon.png|favicon-32x32.png|favicon-16x16.png|android-chrome-192x192.png|android-chrome-512x512.png|site.webmanifest)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
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
    // Add webpack configuration for favicon handling
    webpack(config) {
        config.module.rules.push({
            test: /\.(ico|png|webmanifest)$/i,
            type: 'asset/resource',
            generator: {
                filename: 'static/[name][ext]',
            },
        });
        return config;
    },
    // Ensure that favicon files are treated as static assets
    async rewrites() {
        return [
            {
                source: '/favicon.ico',
                destination: '/public/favicon.ico',
            },
            {
                source: '/site.webmanifest',
                destination: '/public/site.webmanifest',
            },
        ];
    },
};

module.exports = nextConfig;