module.exports = {
  openapi: '3.1.0',
  info: { title: 'Tenant Billing API', version: '3.0.0' },
  servers: [{ url: 'https://api.billing.example.com/v3' }],
  paths: {
    '/invoices': {
      get: {
        operationId: 'listInvoices',
        responses: {
          200: { description: 'Invoices', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Invoice' } } } } },
          400: {
            description: 'Keywords next to $ref extend the referenced schema',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProblemBase', properties: { stack_trace: { type: ['string', 'null'] } } },
              },
            },
          },
          404: {
            description: 'Percent-encoded pointer into $defs',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Problem/%24defs/Debug' } } },
          },
          409: { description: 'Chained refs with siblings', content: { 'application/json': { schema: { $ref: '#/components/schemas/ConflictProblem' } } } },
          500: {
            description: 'Property defined by reference',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { stackTrace: { $ref: '#/components/schemas/StackFrames' }, frames: { $ref: '#/components/schemas/StackFrames' } } },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Invoice: { type: 'object', properties: { id: { type: 'string' }, total: { type: 'number' } } },
      ProblemBase: { type: 'object', properties: { title: { type: 'string' }, status: { type: 'integer' } } },
      Problem: {
        type: 'object',
        properties: { title: { type: 'string' } },
        $defs: { Debug: { type: 'object', properties: { host: { type: 'string' }, StackTrace: { type: 'string' } } } },
      },
      ConflictProblem: { $ref: '#/components/schemas/ConflictBase', properties: { 'conflict-stack-trace': { type: 'string' } } },
      ConflictBase: { $ref: '#/components/schemas/ProblemBase', properties: { conflictingId: { type: 'string' }, STACKTRACE: { type: 'string' } } },
      StackFrames: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, line: { type: 'integer' } } } },
    },
  },
};
