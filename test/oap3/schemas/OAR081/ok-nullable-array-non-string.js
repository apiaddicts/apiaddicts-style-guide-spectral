module.exports = {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'OAR081 — nullable array-typed non-string password field is out of scope',
  },
  paths: {},
  components: {
    schemas: {
      Credentials: {
        type: 'object',
        properties: {
          password_count: { type: ['integer', 'null'] },
        },
      },
    },
  },
};
