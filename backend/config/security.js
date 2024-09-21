module.exports = ({ env }) => ({
  cors: {
    enabled: true,
    origin: ['http://localhost:1337', 'http://localhost:3000'],
  },
  csrf: {
    enabled: true,
    key: '_csrf',
    secret: env('CSRF_SECRET', 'csrf_secret'),
  },
  xss: {
    enabled: true,
  },
  hsts: {
    enabled: true,
    maxAge: 31536000,
    includeSubDomains: true,
  },
  frameguard: {
    enabled: true,
    action: 'sameorigin',
  },
});