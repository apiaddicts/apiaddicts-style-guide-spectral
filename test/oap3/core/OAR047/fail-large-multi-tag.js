module.exports = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'Fleet Management Platform',
  },
  tags: [
    { name: 'alpha', description: 'Device onboarding operations' },
    { name: 'beta', description: 'User profile management operations' },
    { name: 'gamma' },
    { name: 'delta', description: 'Device firmware operations' },
    { name: 'epsilon', description: 'User preference operations' },
    { name: 'zeta', description: 'Order lifecycle operations' },
    { name: 'eta', description: 'Order fulfillment operations' },
    { name: 'theta', description: 'Order billing operations' },
    { name: 'beta', description: 'A second, duplicated declaration of beta' },
  ],
  paths: {
    '/devices': {
      get: {
        tags: ['alpha'],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        tags: ['alpha', 'delta'],
        responses: { 201: { description: 'Created' } },
      },
    },
    '/devices/{deviceId}': {
      get: {
        tags: ['alpha', 'legacy-tag'],
        responses: { 200: { description: 'OK' } },
      },
      patch: {
        tags: ['alpha'],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/users': {
      get: {
        tags: ['beta'],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        tags: ['beta', 'epsilon', 'temp-tag'],
        responses: { 201: { description: 'Created' } },
      },
    },
    '/users/{userId}': {
      get: {
        tags: ['beta', 'gamma'],
        responses: { 200: { description: 'OK' } },
      },
      delete: {
        tags: ['removed-tag'],
        responses: { 204: { description: 'No Content' } },
      },
    },
    '/orders': {
      get: {
        tags: ['zeta', 'eta', 'theta'],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/reports': {
      get: {
        tags: ['analytics-tag'],
        responses: { 200: { description: 'OK' } },
      },
    },
  },
};
