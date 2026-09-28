module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR079 Swagger 2.0 shared path-item parameter with 404 - ok',
  },
  paths: {
    '/devices/{deviceId}': {
      parameters: [
        { name: 'deviceId', in: 'path', required: true, type: 'string' },
      ],
      get: {
        summary: 'Get a device - operation declares no parameters of its own',
        responses: {
          '200': { description: 'OK' },
          '404': { description: 'Not Found' },
        },
      },
    },
  },
};
