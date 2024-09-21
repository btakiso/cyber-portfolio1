import { Strapi } from '@strapi/strapi';

export default ({ env }: { env: Strapi['config']['functions']['env'] }) => ({
    'users-permissions': {
      config: {
        jwtSecret: env('JWT_SECRET')
      }
    },
    upload: {
      config: {
        provider: 'local', // Changed from 'aws-s3' to 'local' for simplicity
        providerOptions: {} // Removed AWS-specific options
      },
    },
    graphql: {
      config: {
        endpoint: '/graphql',
        shadowCRUD: true,
        playgroundAlways: false,
        depthLimit: 7,
        amountLimit: 100,
        apolloServer: {
          tracing: false,
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