module.exports = {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'OAR081 — nullable array-typed password without format: password',
  },
  paths: {},
  components: {
    schemas: {
      Credentials: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          password: { type: ['string', 'null'] },
        },
      },
    },
  },
};
