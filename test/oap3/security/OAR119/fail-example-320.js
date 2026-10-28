const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.2.0',
  $self: 'https://api.home.example.com/openapi.yaml',
  info: { title: 'Smart Home Devices API', version: '1.3.0' },
  servers: [{ url: 'https://api.home.example.com/v1', name: 'production' }],
  paths: {
    '/devices': {
      query: { operationId: 'searchDevices', security: [{ DeviceOAuth: [] }], responses: ok },
      additionalOperations: {
        LINK: { operationId: 'linkDevice', security: [{ LinkOAuth: [] }], responses: { 204: { description: 'Linked' } } },
      },
    },
    '/firmware': { get: { operationId: 'listFirmware', security: [{ '#/components/securitySchemes/FirmwareOAuth': [] }], responses: ok } },
    '/scenes': {
      get: {
        operationId: 'listScenes',
        security: [{ 'https://api.home.example.com/openapi.yaml#/components/securitySchemes/ScenesOAuth': [] }],
        responses: ok,
      },
    },
  },
  components: {
    securitySchemes: {
      DeviceOAuth: {
        type: 'oauth2',
        oauth2MetadataUrl: 'http://auth.home.example.com/.well-known/oauth-authorization-server',
        flows: {
          deviceAuthorization: {
            deviceAuthorizationUrl: 'http://auth.home.example.com/device',
            tokenUrl: 'https://auth.home.example.com/token',
            scopes: {},
          },
          authorizationCode: {
            authorizationUrl: 'https://auth.home.example.com/oauth/authorise',
            tokenUrl: 'https://auth.home.example.com/token',
            scopes: {},
          },
        },
      },
      LinkOAuth: { type: 'oauth2', flows: { implicit: { authorizationUrl: 'https://auth.home.example.com/authorize#consent', scopes: {} } } },
      FirmwareOAuth: { type: 'oauth2', flows: { implicit: { authorizationUrl: 'https://auth.home.example.com/Authorize', scopes: {} } } },
      ScenesOAuth: {
        type: 'oauth2',
        deprecated: true,
        flows: { implicit: { authorizationUrl: 'http://legacy.home.example.com/authorize', scopes: {} } },
      },
    },
  },
};
