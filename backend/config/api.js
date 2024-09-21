module.exports = ({ env }) => ({
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
  },
  responses: {
    privateAttributes: ['created_by', 'updated_by'],
  },
  requestTimeout: 30000,
});
