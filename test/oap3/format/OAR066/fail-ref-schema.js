module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'OAR066 ref schema fixture',
  },
  paths: {
    '/widgets': {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WidgetInput' },
            },
          },
        },
        responses: {
          200: { description: 'OK' },
        },
      },
    },
  },
  components: {
    schemas: {
      WidgetInput: {
        type: 'object',
        properties: {
          widgetName: { type: 'string' },
          widget_code: { type: 'string' },
        },
      },
    },
  },
};
