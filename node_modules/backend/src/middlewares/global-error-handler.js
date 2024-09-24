module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      strapi.log.error(error);
      ctx.status = error.status || 500;
      ctx.body = {
        error: {
          message: error.message || 'An unexpected error occurred',
          status: ctx.status,
        },
      };
    }
  };
};