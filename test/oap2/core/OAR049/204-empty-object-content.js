module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR049 Empty Object Content Fixture API',
  },
  paths: {
    '/invoices/{invoiceId}': {
      delete: {
        summary: 'Void an invoice',
        parameters: [
          {
            in: 'path',
            name: 'invoiceId',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          204: {
            description: 'Invoice voided, schema explicitly declared empty',
            schema: {},
          },
        },
      },
    },
  },
};
