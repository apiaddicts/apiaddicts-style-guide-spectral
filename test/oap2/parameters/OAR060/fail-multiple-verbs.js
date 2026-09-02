const q = [{ in: 'query', name: 'q', type: 'string', required: true }];

module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR060' },
  paths: {
    '/a': { get: { parameters: q, responses: { 200: { description: 'OK' } } } },
    '/b': { post: { parameters: q, responses: { 201: { description: 'Created' } } } },
    '/c': { put: { parameters: q, responses: { 200: { description: 'OK' } } } },
    '/d': { patch: { parameters: q, responses: { 200: { description: 'OK' } } } },
    '/e': { delete: { parameters: q, responses: { 204: { description: 'No Content' } } } },
  },
};
