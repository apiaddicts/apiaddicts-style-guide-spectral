module.exports = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'OAR049 Empty Object Content Fixture API',
  },
  paths: {
    '/invoices/{invoiceId}': {
      delete: {
        summary: 'Void an invoice',
        responses: {
          204: {
            description: 'Invoice voided, content explicitly declared empty',
            content: {},
          },
        },
      },
    },
  },
};
