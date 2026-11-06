const RESOURCES = ['accounts', 'branches', 'cards', 'loans', 'mandates', 'payees', 'payments', 'statements', 'transfers', 'wallets'];
const VARIANTS = ['stackTrace', 'stack_trace', 'STACK-TRACE', 'StackTrace'];
const REGIONS = 12;

const errorRef = { $ref: '#/definitions/ErrorEnvelope' };
const paths = {};

for (let region = 0; region < REGIONS; region += 1) {
  RESOURCES.forEach((resource, index) => {
    const collection = `/regions${region}/${resource}`;
    const item = `${collection}/{${resource}Id}`;
    const inline = (region * RESOURCES.length + index) % 7 === 0;
    paths[collection] = {
      get: {
        operationId: `list${region}${resource}`,
        responses: {
          200: { description: 'Found', schema: { type: 'array', items: { $ref: '#/definitions/Resource' } } },
          400: { description: 'Bad request', schema: errorRef },
          500: inline
            ? { description: 'Server error', schema: { type: 'object', properties: { message: { type: 'string' }, [VARIANTS[index % VARIANTS.length]]: { type: 'string' } } } }
            : { $ref: '#/responses/ServerError' },
        },
      },
      post: {
        operationId: `create${region}${resource}`,
        parameters: [{ name: 'body', in: 'body', schema: { $ref: '#/definitions/Resource' } }],
        responses: {
          201: { description: 'Created', schema: { $ref: '#/definitions/Resource' } },
          409: { description: 'Conflict', schema: errorRef },
        },
      },
    };
    paths[item] = {
      parameters: [{ name: `${resource}Id`, in: 'path', required: true, type: 'string' }],
      get: {
        operationId: `get${region}${resource}`,
        responses: { 200: { description: 'Found', schema: { $ref: '#/definitions/Resource' } }, 404: { description: 'Not found', schema: errorRef } },
      },
      put: {
        operationId: `update${region}${resource}`,
        responses: { 200: { description: 'Updated', schema: { $ref: '#/definitions/DebugResource' } }, 422: { description: 'Invalid', schema: errorRef } },
      },
      delete: {
        operationId: `delete${region}${resource}`,
        responses: { 204: { description: 'Deleted' }, 503: { $ref: '#/responses/ServerError' } },
      },
    };
  });
}

module.exports = {
  swagger: '2.0',
  info: { title: 'Retail Banking Core API', version: '7.0.0' },
  host: 'api.bank.example.com',
  basePath: '/core',
  schemes: ['https'],
  produces: ['application/json'],
  paths,
  responses: {
    ServerError: { description: 'Server error', schema: { type: 'object', properties: { message: { type: 'string' }, traceId: { type: 'string' } } } },
  },
  definitions: {
    Resource: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } } },
    DebugResource: { type: 'object', properties: { id: { type: 'string' }, stackTrace: { type: 'string' } } },
    ErrorEnvelope: {
      type: 'object',
      properties: {
        errors: { type: 'array', items: { type: 'object', properties: { code: { type: 'string' }, errorStackTrace: { type: 'string' } } } },
      },
    },
  },
};

module.exports['x-expected-inline'] = [];
for (let region = 0; region < REGIONS; region += 1) {
  RESOURCES.forEach((resource, index) => {
    if ((region * RESOURCES.length + index) % 7 === 0) {
      module.exports['x-expected-inline'].push([`/regions${region}/${resource}`, VARIANTS[index % VARIANTS.length]]);
    }
  });
}
