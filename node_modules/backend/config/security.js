module.exports = ({ env }) => ({
  cors: {
    enabled: true,
    origin: ['https://api.bereketakiso.com', 'https://bereketakiso.com', 'https://www.bereketakiso.com'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    credentials: true,
  },
  csrf: {
    enabled: false, // Disable CSRF for API
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