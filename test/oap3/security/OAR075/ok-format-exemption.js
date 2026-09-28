module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR075 ok format exemption' },
  paths: {
    '/users/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      get: {
        parameters: [
          { name: 'from', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'updatedAt', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'clientIp', in: 'query', schema: { type: 'string', format: 'ipv4' } },
          { name: 'X-Forwarded-For', in: 'header', schema: { type: 'string', format: 'ipv6' } },
          { name: 'upperCase', in: 'query', schema: { type: 'string', format: 'DATE-TIME' } },
          { name: 'padded', in: 'query', schema: { type: 'string', format: '  uuid  ' } },
          { name: 'exemptAndBounded', in: 'cookie', schema: { type: 'string', format: 'date', minLength: 10 } },
          { name: 'nonExemptButPattern', in: 'cookie', schema: { type: 'string', format: 'password', pattern: '^.{8,}$' } },
          { name: 'numericWithExemptFormat', in: 'query', schema: { type: 'integer', format: 'date' } },
          {
            name: 'contentOnly',
            in: 'query',
            content: { 'application/json': { schema: { type: 'string', format: 'foo' } } },
          },
        ],
        responses: { 200: { description: 'ok' } },
      },
    },
  },
  components: {
    parameters: {
      ExemptInComponents: { name: 'exemptInComponents', in: 'query', schema: { type: 'string', format: 'uuid' } },
    },
  },
};
