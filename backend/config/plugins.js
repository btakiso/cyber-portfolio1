module.exports = {
  // Example: configuring the upload plugin
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_SECRET,
        region: process.env.AWS_REGION,
        params: {
          Bucket: process.env.AWS_BUCKET_NAME,
        },
      },
    },
  },
  // Add other plugin configurations as needed
  graphql: {
    enabled: true,
    config: {
      defaultLimit: 10,
      maxLimit: 100,
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
};