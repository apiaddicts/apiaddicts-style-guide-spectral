const responses = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Billing API', version: '1.0.0' },
  servers: { $ref: '#/x-server-lists/public' },
  paths: {
    '/invoices': {
      servers: [{ $ref: '#/x-servers/production' }],
      get: { operationId: 'listInvoices', responses },
    },
    '/reports': { $ref: '#/x-path-items/Reports' },
    '/payments': {
      get: { operationId: 'listPayments', servers: [{ $ref: '#/x-servers/chained' }], responses },
    },
    '/tenants': {
      get: {
        operationId: 'listTenants',
        servers: [{ url: 'https://{tenant}.billing.example.com/api-billing/v1', variables: { tenant: { $ref: '#/x-variables/tenant' } } }],
        responses,
      },
    },
  },
  'x-servers': {
    production: { url: 'https://billing.example.com/api-billing/v1' },
    chained: { $ref: '#/x-servers/upstream' },
    upstream: { url: 'http://billing-service:8080/api-billing/v1' },
  },
  'x-server-lists': {
    public: [{ $ref: '#/x-servers/production' }, { url: 'https://eu.billing.example.com/api-billing/v1' }],
  },
  'x-variables': {
    tenant: { default: 'acme', enum: ['acme', 'globex'] },
  },
  'x-path-items': {
    Reports: {
      servers: [{ url: 'https://reports.billing.example.com/api-billing/v1' }, { $ref: '#/x-servers/production' }],
      get: { operationId: 'listReports', responses },
    },
  },
};
