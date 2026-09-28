
module.exports = {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'OAR081 — realistic multi-schema fixture with mixed password field shapes',
  },
  paths: {},
  components: {
    schemas: {
      LoginRequest: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          password: { type: 'string' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          oldPassword: { type: ['string', 'null'] },
        },
      },
      ChangePasswordRequest: {
        type: 'object',
        properties: {
          password_confirm: { type: 'string', format: 'password' },
          newPassword: { type: ['string', 'null'], format: 'password' },
        },
      },
      ChangePasswordResponse: {
        type: 'object',
        properties: {
          fecha_renovacion_password: { type: 'string' },
        },
      },
      UserAccount: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          password_count: { type: ['integer', 'null'] },
        },
      },
      AdminSettings: {
        type: 'object',
        properties: {
          password_hint: { type: ['string', 'null'] },
          security_password: { type: 'string', format: 'password' },
        },
      },
    },
  },
};
