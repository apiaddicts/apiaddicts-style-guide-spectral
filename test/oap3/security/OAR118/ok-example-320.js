module.exports = {
  openapi: '3.2.0',
  $self: 'https://api.home.example.com/openapi.yaml',
  info: {
    title: 'Smart Home Devices API',
    summary: 'Pair, control and update connected home devices.',
    version: '1.4.0',
  },
  servers: [{ url: 'https://api.home.example.com/v1', name: 'production' }],
  security: [{ '#/components/securitySchemes/HomeOAuth': ['devices:read'] }],
  paths: {
    '/devices': {
      query: {
        operationId: 'searchDevices',
        responses: { 200: { description: 'Matching devices' } },
      },
      additionalOperations: {
        LINK: {
          operationId: 'linkDevice',
          security: [{ 'https://api.home.example.com/openapi.yaml#/components/securitySchemes/HomeOAuth': [] }],
          responses: { 204: { description: 'Device linked' } },
        },
      },
    },
    '/firmware': {
      get: {
        operationId: 'listFirmware',
        security: [{ ServiceOAuth: [] }],
        responses: { 200: { description: 'Firmware releases' } },
      },
    },
  },
  components: {
    securitySchemes: {
      HomeOAuth: {
        type: 'oauth2',
        oauth2MetadataUrl: 'https://auth.home.example.com/.well-known/oauth-authorization-server',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://auth.home.example.com/authorize',
            tokenUrl: 'https://auth.home.example.com/token',
            scopes: { 'devices:read': 'Read devices' },
          },
        },
      },
      ServiceOAuth: {
        type: 'oauth2',
        deprecated: false,
        flows: { clientCredentials: { tokenUrl: 'https://auth.home.example.com/token', scopes: {} } },
      },
    },
  },
};
