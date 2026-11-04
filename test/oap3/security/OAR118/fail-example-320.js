module.exports = {
  openapi: '3.2.0',
  $self: 'https://api.home.example.com/openapi.yaml',
  info: {
    title: 'Smart Home Devices API',
    summary: 'Pair, control and update connected home devices.',
    version: '1.3.0',
  },
  servers: [{ url: 'https://api.home.example.com/v1', name: 'production' }],
  paths: {
    '/devices': {
      query: {
        operationId: 'searchDevices',
        security: [{ DeviceOAuth: ['devices:read'] }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { room: { type: ['string', 'null'] } } } } },
        },
        responses: { 200: { description: 'Matching devices' } },
      },
      additionalOperations: {
        LINK: {
          operationId: 'linkDevice',
          security: [{ LinkOAuth: [] }],
          responses: { 204: { description: 'Device linked' } },
        },
      },
    },
    '/firmware': {
      get: {
        operationId: 'listFirmware',
        security: [{ '#/components/securitySchemes/FirmwareOAuth': [] }],
        responses: { 200: { description: 'Firmware releases' } },
      },
    },
    '/scenes': {
      get: {
        operationId: 'listScenes',
        security: [{ 'https://api.home.example.com/openapi.yaml#/components/securitySchemes/ScenesOAuth': [] }],
        responses: { 200: { description: 'Scenes' } },
      },
    },
    '/legacy/rooms': {
      get: {
        operationId: 'listRoomsLegacy',
        deprecated: true,
        security: [{ LegacyOAuth: [] }],
        responses: { 200: { description: 'Rooms' } },
      },
    },
  },
  components: {
    securitySchemes: {
      DeviceOAuth: {
        type: 'oauth2',
        oauth2MetadataUrl: 'https://auth.home.example.com/.well-known/oauth-authorization-server',
        flows: {
          deviceAuthorization: {
            deviceAuthorizationUrl: 'https://auth.home.example.com/device',
            tokenUrl: 'https://auth.home.example.com/token',
            scopes: { 'devices:read': 'Read devices' },
          },
          authorizationCode: {
            authorizationUrl: 'https://auth.home.example.com/authorize',
            tokenUrl: 'https://auth.home.example.com/token',
            scopes: { 'devices:read': 'Read devices' },
          },
        },
      },
      LinkOAuth: {
        type: 'oauth2',
        flows: { password: { tokenUrl: 'https://auth.home.example.com/token', scopes: {} } },
      },
      FirmwareOAuth: {
        type: 'oauth2',
        flows: { implicit: { authorizationUrl: 'https://auth.home.example.com/authorize', scopes: {} } },
      },
      ScenesOAuth: {
        type: 'oauth2',
        flows: { password: { tokenUrl: 'https://auth.home.example.com/token', scopes: {} } },
      },
      LegacyOAuth: {
        type: 'oauth2',
        deprecated: true,
        flows: { implicit: { authorizationUrl: 'https://auth.home.example.com/authorize', scopes: {} } },
      },
    },
  },
};
