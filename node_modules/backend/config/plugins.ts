import { Strapi } from '@strapi/strapi';

export default ({ env }: { env: Strapi['config']['functions']['env'] }) => ({
    'users-permissions': {
      config: {
        jwtSecret: env('JWT_SECRET')
      }
    },
    upload: {
      config: {
        provider: 'aws-s3',
        providerOptions: {
          accessKeyId: env('AWS_ACCESS_KEY_ID'),
          secretAccessKey: env('AWS_ACCESS_SECRET'),
          region: env('AWS_REGION'),
          params: {
            Bucket: env('AWS_BUCKET_NAME'),
            ACL: env('AWS_ACL', 'public-read'),
          },
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
      },
    },
    'documentation': {
      enabled: true,
      config: {
        openapi: '3.0.0',
        info: {
          version: '1.0.0',
          title: 'DOCUMENTATION',
          description: 'Documentation of your Strapi API',
          termsOfService: 'YOUR_TERMS_OF_SERVICE_URL',
          contact: {
            name: 'TEAM',
            email: 'contact-email@something.io',
            url: 'mywebsite.io'
          },
          license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
          },
        },
        'x-strapi-config': {
          plugins: ['upload', 'users-permissions'],
          path: '/documentation',
        },
      },
    },
});