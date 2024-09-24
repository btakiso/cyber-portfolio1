module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    strapi.log.info(`Incoming request: ${ctx.method} ${ctx.url}`);
    await next();
  };
};