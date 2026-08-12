module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'OAR081 — string password without format: password',
  },
  paths: {},
  components: {
    schemas: {
      Credentials: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          password: { type: 'string' },
        },
      },
    },
  },
};
