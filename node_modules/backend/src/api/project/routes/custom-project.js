module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/projects/featured',
      handler: 'featured.getFeaturedProjects',
      config: {
        auth: false,
      },
    },
  ],
};