module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'http:', 'https:'],
          'img-src': [
            "'self'", 
            'data:', 
            'blob:', 
            'https://cyber-portfolio-72310aa69f55.herokuapp.com/', 
            'https://cyber-portfolio1.vercel.app',
            'https://strapi-s3-bucket1.s3.amazonaws.com' 
          ],
          'media-src': [
            "'self'", 
            'data:', 
            'blob:', 
            'https://cyber-portfolio-72310aa69f55.herokuapp.com/',
            'https://cyber-portfolio1.vercel.app',
            'https://strapi-s3-bucket1.s3.amazonaws.com' 
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['https://cyber-portfolio1.vercel.app', 'http://localhost:3000'],
      headers: ['*'],
    }
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];