const responses = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Billing API', version: '1.0.0' },
  servers: [
    { $ref: '#/x-servers/relative' },
    { $ref: '#/x-servers/chained' },
    { $ref: '#/x-servers/production' },
  ],
  paths: {
    '/invoices': {
      servers: [{ $ref: '#/x-servers/relative' }],
      get: { operationId: 'listInvoices', responses },
    },
    '/reports': { $ref: '#/x-path-items/Reports' },
    '/reports/archive': { $ref: '#/x-path-items/Reports' },
    '/payments': {
      get: { operationId: 'listPayments', servers: { $ref: '#/x-server-lists/internal' }, responses },
    },
    '/refunds': {
      get: { operationId: 'listRefunds', servers: [{ $ref: '#/x-servers/missing' }], responses },
    },
    '/tenants': {
      get: {
        operationId: 'listTenants',
        servers: [{ url: 'https://{tenant}.billing.example.com/api-billing/v1', variables: { tenant: { $ref: '#/x-variables/tenantWithoutDefault' } } }],
        responses,
      },
    },
    '/accounts/{accountId}': { $ref: '#/x-path-items/Accounts%20v2' },
  },
  'x-servers': {
    relative: { url: '/api-billing/v1' },
    chained: { $ref: '#/x-servers/chainedTarget' },
    chainedTarget: { url: 'billing.example.com/api-billing/v1' },
    production: { url: 'https://billing.example.com/api-billing/v1' },
  },
  'x-server-lists': {
    internal: [{ url: '/internal' }, { url: 'https://payments.billing.example.com/api-billing/v1' }],
  },
  'x-variables': {
    tenantWithoutDefault: { enum: ['acme', 'globex'] },
  },
  'x-path-items': {
    Reports: {
      servers: [{ url: '/reports' }],
      get: { operationId: 'listReports', responses },
    },
    'Accounts v2': {
      get: { operationId: 'getAccount', servers: [{ url: 'ftp://accounts.billing.example.com' }], responses },
    },
  },
};
