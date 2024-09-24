module.exports = {
  async getFeaturedProjects(ctx) {
    try {
      const featuredProjects = await strapi.query('api::project.project').find({
        where: { featured: true },
        populate: ['image'],
      });
      return ctx.send(featuredProjects);
    } catch (err) {
      ctx.body = err;
    }
  },
};