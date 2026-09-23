module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'Billing API' },
  paths: {
    '/invoices': { get: { responses: { 200: { description: 'OK' } } } }
  },
  definitions: {
    Invoice: {
      title: 'Test Invoice Definition',
      type: 'object',
      properties: {
        id: { title: 'Sandbox Identifier', type: 'string' }
      }
    }
  },
  parameters: {
    InvoiceId: { name: 'invoiceId', in: 'path', required: true, type: 'string', description: 'Test parameter' }
  }
};
