module.exports = ({ env }) => ({
  cors: {
    enabled: true,
    origin: ['https://api.bereketakiso.com/', 'https://bereketakiso.com'],
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