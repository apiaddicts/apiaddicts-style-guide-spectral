module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR075 ok format exemption' },
  paths: {
    '/users/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, type: 'string', format: 'uuid' },
      ],
      get: {
        parameters: [
          { name: 'from', in: 'query', type: 'string', format: 'date' },
          { name: 'updatedAt', in: 'query', type: 'string', format: 'date-time' },
          { name: 'clientIp', in: 'query', type: 'string', format: 'ipv4' },
          { name: 'X-Forwarded-For', in: 'header', type: 'string', format: 'ipv6' },
          { name: 'upperCase', in: 'query', type: 'string', format: 'DATE-TIME' },
          { name: 'padded', in: 'query', type: 'string', format: '  uuid  ' },
          { name: 'exemptAndBounded', in: 'formData', type: 'string', format: 'date', minLength: 10 },
          { name: 'nonExemptButPattern', in: 'formData', type: 'string', format: 'password', pattern: '^.{8,}$' },
          { name: 'numericWithExemptFormat', in: 'query', type: 'integer', format: 'date' },
        ],
        responses: { 200: { description: 'ok' } },
      },
    },
  },
  parameters: {
    Global: { name: 'global', in: 'query', type: 'string', format: 'uuid' },
  },
};
