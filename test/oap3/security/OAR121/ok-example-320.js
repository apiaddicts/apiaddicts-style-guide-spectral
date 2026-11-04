const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.2.0',
  $self: 'https://api.home.example.com/openapi.yaml',
  info: { title: 'Smart Home Devices API', version: '1.4.0' },
  servers: [{ url: 'https://api.home.example.com/v1', name: 'production' }],
  security: [{ '#/components/securitySchemes/HomeOAuth': [] }],
  paths: {
    '/devices': {
      query: { operationId: 'searchDevices', responses: ok },
      additionalOperations: {
        LINK: {
          operationId: 'linkDevice',
          security: [{ 'https://api.home.example.com/openapi.yaml#/components/securitySchemes/DeviceBearer': [] }],
          responses: { 204: { description: 'Linked' } },
        },
      },
    },
    '/health': {
      get: { operationId: 'health', security: [{ '#/components/securitySchemes/MonitoringKey': [] }], responses: ok },
    },
  },
  components: {
    securitySchemes: {
      HomeOAuth: {
        type: 'oauth2',
        flows: { deviceAuthorization: { deviceAuthorizationUrl: 'https://auth.home.example.com/device', tokenUrl: 'https://auth.home.example.com/token', scopes: {} } },
      },
      DeviceBearer: { type: 'http', scheme: 'bearer', deprecated: false },
      MonitoringKey: { type: 'apiKey', in: 'header', name: 'X-Monitoring-Key' },
    },
  },
};
