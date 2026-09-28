module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR010 fail example (mixed case, oas2)' },
  produces: ['application/xml'],
  paths: {
    '/reports': {
      post: {
        responses: {
          201: { description: 'Only application/xml via global produces' },
        },
      },
    },
  },
};
