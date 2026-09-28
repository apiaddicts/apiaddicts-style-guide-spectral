module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'OAR079 OpenAPI 3.0 large multi-path - fail',
  },
  paths: {
    '/devices/{deviceId}': {
      parameters: [
        { name: 'deviceId', in: 'path', required: true, schema: { type: 'string' } },
      ],
      get: {
        summary: 'Get a device',
        responses: {
          '200': { description: 'OK' },
        },
      },
      patch: {
        summary: 'Update a device',
        parameters: [
          { name: 'deviceId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
    '/devices/{deviceId}/logs': {
      parameters: [
        { name: 'deviceId', in: 'path', required: true, schema: { type: 'string' } },
      ],
      get: {
        summary: 'List device logs - compliant, has a 404',
        responses: {
          '200': { description: 'OK' },
          '404': { description: 'Not Found' },
        },
      },
    },
    '/reports/{reportId}': {
      get: {
        summary: 'Get a report',
        parameters: [
          { name: 'reportId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
    '/reports/{reportId}/export': {
      get: {
        summary: 'Export a report',
        parameters: [
          { name: 'reportId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'format', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
    '/health': {
      get: {
        summary: 'Health check - no path parameters at all',
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
    '/orders/{orderId}': {
      post: {
        summary: 'Reopen an order - compliant, has a 404',
        parameters: [
          { name: 'orderId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'OK' },
          '404': { description: 'Not Found' },
        },
      },
    },
    '/tickets/{ticketId}': {
      parameters: [
        { name: 'ticketId', in: 'path', required: true, schema: { type: 'string' } },
      ],
      get: {
        summary: 'Get a ticket',
        responses: {
          '200': { description: 'OK' },
        },
      },
      delete: {
        summary: 'Delete a ticket - compliant, has a 404',
        responses: {
          '204': { description: 'No Content' },
          '404': { description: 'Not Found' },
        },
      },
    },
  },
};
