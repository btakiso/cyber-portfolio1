module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'", 'https:'],
          'frame-src': ["'self'", 'https://www.youtube.com'],
          'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          'font-src': ["'self'", 'https://fonts.gstatic.com'],
          'connect-src': ["'self'", 'https:', 'http:', 'ws:', 'wss:', 'https://api.bereketakiso.com', 'https://bereketakiso.com', 'https://www.bereketakiso.com', 'https://cyber-portfolio-72310aa69f55.herokuapp.com'],
          'img-src': [
            "'self'", 
            'data:', 
            'blob:', 
            'https:', 
            'http:',
            'https://api.bereketakiso.com', 
            'https://bereketakiso.com',
            'https://www.bereketakiso.com',
            'https://cyber-portfolio-72310aa69f55.herokuapp.com',
            'https://*.amazonaws.com' 
          ],
          'media-src': [
            "'self'", 
            'data:', 
            'blob:', 
            'https:', 
            'http:',
            'https://api.bereketakiso.com', 
            'https://bereketakiso.com',
            'https://www.bereketakiso.com',
            'https://cyber-portfolio-72310aa69f55.herokuapp.com',
            'https://*.amazonaws.com' 
          ],
          'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https:', 'http:'],
          'frame-src': ["'self'", 'https://www.youtube.com'],
          'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          'font-src': ["'self'", 'https://fonts.gstatic.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['https://bereketakiso.com', 'https://www.bereketakiso.com', 'https://api.bereketakiso.com', 'https://cyber-portfolio-72310aa69f55.herokuapp.com', 'http://localhost:3000'],
      headers: ['*'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      keepHeaderOnError: true,
      credentials: true,
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