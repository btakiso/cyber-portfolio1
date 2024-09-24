module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    await next();
    strapi.log.info(`Outgoing response: ${ctx.status} ${ctx.method} ${ctx.url}`);
    ctx.set('X-Powered-By', 'Strapi');
  };
};