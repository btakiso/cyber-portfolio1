module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: env('PUBLIC_URL', 'https://cyber-portfolio.herokuapp.com'),
  // Make sure CORS is properly configured
  cors: {
    origin: ['http://localhost:3000'], // Add your frontend URL here
  },
});
