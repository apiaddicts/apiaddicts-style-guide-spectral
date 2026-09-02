const op = { get: { responses: { 200: { description: 'OK' } } } };

// Used with pattern ^/v[0-9]+ : /v1/pets passes, /pets fails.
module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR116' },
  paths: {
    '/v1/pets': op,
    '/pets': op,
  },
};
