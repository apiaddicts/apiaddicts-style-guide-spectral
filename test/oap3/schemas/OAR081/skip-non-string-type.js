module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'OAR081 — non-string password type is out of scope',
  },
  paths: {},
  components: {
    schemas: {
      Credentials: {
        type: 'object',
        properties: {
          password: { type: 'integer' },
        },
      },
    },
  },
};
