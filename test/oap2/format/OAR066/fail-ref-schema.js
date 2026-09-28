module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR066 ref schema fixture',
  },
  host: 'petstore.swagger.io',
  basePath: '/v2',
  paths: {
    '/widgets': {
      post: {
        parameters: [
          {
            in: 'body',
            name: 'body',
            schema: { $ref: '#/definitions/WidgetInput' },
          },
        ],
        responses: {
          200: { description: 'OK' },
        },
      },
    },
  },
  definitions: {
    WidgetInput: {
      type: 'object',
      properties: {
        widgetName: { type: 'string' },
        widget_code: { type: 'string' },
      },
    },
  },
};
