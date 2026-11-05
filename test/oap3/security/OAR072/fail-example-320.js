module.exports = {
  openapi: '3.2.0',
  $self: 'https://api.markets.example.com/openapi.json',
  info: { title: 'Market Data Streaming API', version: '1.0.0' },
  servers: [{ url: 'https://api.markets.example.com/v1' }],
  paths: {
    '/quotes': {
      query: {
        operationId: 'searchQuotes',
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { symbols: { type: 'array', items: { type: 'string' } } } } } } },
        responses: {
          200: { description: 'Matching quotes', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Quote' } } } } },
          400: { description: 'Invalid query', content: { 'application/json': { schema: { type: ['object', 'null'], properties: { stackTrace: { type: ['string', 'null'] } } } } } },
        },
      },
      get: {
        operationId: 'streamQuotes',
        responses: {
          200: { description: 'Live quotes', content: { 'application/jsonl': { itemSchema: { $ref: '#/components/schemas/Quote' } } } },
          503: {
            description: 'Feed degraded, error events are streamed',
            content: {
              'text/event-stream': {
                itemSchema: { type: 'object', properties: { event: { type: 'string' }, data: { type: 'object', properties: { 'stack-trace': { type: 'string' } } } } },
              },
            },
          },
          default: { description: 'Problem', content: { 'application/problem+json': { $ref: '#/components/mediaTypes/Problem' } } },
        },
      },
      additionalOperations: {
        PURGE: {
          operationId: 'purgeQuotes',
          responses: {
            204: { description: 'Cache purged' },
            500: { description: 'Purge failed', content: { 'application/json': { schema: { type: 'object', properties: { stack_trace: { type: 'string' } } } } } },
          },
        },
      },
    },
  },
  components: {
    mediaTypes: {
      Problem: { schema: { type: 'object', properties: { title: { type: 'string' }, StackTrace: { type: 'string' } } } },
    },
    schemas: {
      Quote: { type: 'object', properties: { symbol: { type: 'string' }, price: { type: 'number' }, stackTrace: { type: 'string' } } },
    },
  },
};
