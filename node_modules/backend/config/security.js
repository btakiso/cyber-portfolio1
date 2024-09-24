module.exports = ({ env }) => ({
  cors: {
    enabled: true,
    origin: ['https://cyber-portfolio-72310aa69f55.herokuapp.com/', 'https://cyber-portfolio1.vercel.app'],
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