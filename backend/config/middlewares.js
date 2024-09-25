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
            'https://api.bereketakiso.com/', 
            'https://bereketakiso.com',
            'https://*.amazonaws.com' 
          ],
          'media-src': [
            "'self'", 
            'data:', 
            'blob:', 
            'https://api.bereketakiso.com/', 
            'https://bereketakiso.com',
            'https://*.amazonaws.com' 
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
      origin: ['https://bereketakiso.com', 'http://localhost:3000'],
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