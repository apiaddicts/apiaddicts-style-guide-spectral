const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.2.0',
  $self: 'https://api.home.example.com/openapi.yaml',
  info: { title: 'Smart Home Devices API', version: '1.3.0' },
  servers: [{ url: 'https://api.home.example.com/v1', name: 'production' }],
  paths: {
    '/devices': {
      query: { operationId: 'searchDevices', security: [{ DeviceKey: [] }], responses: ok },
      additionalOperations: {
        LINK: { operationId: 'linkDevice', security: [{ InstallerBasic: [] }], responses: { 204: { description: 'Linked' } } },
      },
    },
    '/firmware': { get: { operationId: 'listFirmware', security: [{ '#/components/securitySchemes/FirmwareCertificate': [] }], responses: ok } },
    '/scenes': {
      get: {
        operationId: 'listScenes',
        security: [{ 'https://api.home.example.com/openapi.yaml#/components/securitySchemes/ScenesKey': [] }],
        responses: ok,
      },
    },
    '/rooms': { get: { operationId: 'listRooms', security: [{ HomeOAuth: [] }], responses: ok } },
  },
  components: {
    securitySchemes: {
      HomeOAuth: {
        type: 'oauth2',
        oauth2MetadataUrl: 'https://auth.home.example.com/.well-known/oauth-authorization-server',
        flows: { deviceAuthorization: { deviceAuthorizationUrl: 'https://auth.home.example.com/device', tokenUrl: 'https://auth.home.example.com/token', scopes: {} } },
      },
      DeviceKey: { type: 'apiKey', in: 'cookie', name: 'device_session' },
      InstallerBasic: { type: 'http', scheme: 'basic' },
      FirmwareCertificate: { type: 'mutualTLS' },
      ScenesKey: { type: 'apiKey', deprecated: true, in: 'header', name: 'X-Scenes-Key' },
    },
  },
};
