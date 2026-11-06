const RESOURCES = ['appointments', 'clinics', 'doctors', 'invoices', 'patients', 'prescriptions', 'referrals', 'rooms', 'shifts'];
const VARIANTS = ['stackTrace', 'stack_trace', 'Stack-Trace', 'STACKTRACE', 'stack trace'];
const REGIONS = 15;

const problem = { 'application/problem+json': { schema: { $ref: '#/components/schemas/Problem' } } };
const paths = {};
const expectedInline = [];

for (let region = 0; region < REGIONS; region += 1) {
  RESOURCES.forEach((resource, index) => {
    const collection = `/regions${region}/${resource}`;
    const item = `${collection}/{${resource}Id}`;
    const position = region * RESOURCES.length + index;
    const variant = VARIANTS[position % VARIANTS.length];
    const inline = position % 6 === 0;
    if (inline) expectedInline.push([item, variant]);
    paths[collection] = {
      get: {
        operationId: `list${region}${resource}`,
        responses: {
          200: { description: 'Found', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Resource' } } } } },
          400: { description: 'Bad request', content: problem },
          '5XX': { $ref: '#/components/responses/ServerError' },
        },
      },
      post: {
        operationId: `create${region}${resource}`,
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Resource' } } } },
        responses: {
          201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Resource' } } } },
          409: { description: 'Conflict', content: problem },
        },
      },
    };
    paths[item] = {
      parameters: [{ name: `${resource}Id`, in: 'path', required: true, schema: { type: 'string' } }],
      get: {
        operationId: `get${region}${resource}`,
        responses: {
          200: { description: 'Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/DebugResource' } } } },
          404: { description: 'Not found', content: problem },
        },
      },
      patch: {
        operationId: `patch${region}${resource}`,
        responses: {
          200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Resource' } } } },
          422: inline
            ? { description: 'Invalid', content: { 'application/json': { schema: { allOf: [{ $ref: '#/components/schemas/Resource' }, { type: 'object', properties: { [variant]: { type: 'string' } } }] } } } }
            : { description: 'Invalid', content: problem },
        },
      },
    };
  });
}

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Hospital Network API', version: '9.0.0' },
  servers: [{ url: 'https://api.hospitals.example.com/v9' }],
  paths,
  components: {
    responses: {
      ServerError: { description: 'Server error', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, traceId: { type: 'string' } } } } } },
    },
    schemas: {
      Resource: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } } },
      DebugResource: { type: 'object', properties: { id: { type: 'string' }, stackTrace: { type: 'string' } } },
      Problem: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          title: { type: 'string' },
          errors: { type: 'array', items: { type: 'object', properties: { detail: { type: 'string' }, causeStackTrace: { type: 'string' } } } },
        },
      },
    },
  },
  'x-expected-inline': expectedInline,
};
