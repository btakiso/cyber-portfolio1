module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: env('PUBLIC_URL', 'https://cyber-portfolio-72310aa69f55.herokuapp.com'),
  // Make sure CORS is properly configured
  cors: {
    origin: ['https://cyber-portfolio1.vercel.app', 'http://localhost:3000'],
  },
});
