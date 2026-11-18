const json = (schema) => ({ 'application/json': { schema } });

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Retail Orders API',
    description: 'Orders, shipping addresses and catalog categories of the retail channel.',
    version: '3.2.0',
  },
  servers: [{ url: 'https://api.retail.example.com/orders/v3' }],
  tags: [{ name: 'orders' }, { name: 'categories' }],
  paths: {
    '/orders': {
      get: {
        tags: ['orders'],
        operationId: 'listOrders',
        parameters: [
          { name: 'page_size', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
          { name: 'filter', in: 'query', content: json({ type: 'object', properties: { order_status: { type: 'string' } } }) },
        ],
        responses: {
          200: {
            description: 'A page of orders',
            headers: {
              'X-Rate-Limit': { schema: { type: 'object', properties: { remaining_calls: { type: 'integer' } } } },
            },
            content: json({
              type: 'object',
              properties: {
                data: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                paging: { $ref: '#/components/schemas/Paging' },
              },
            }),
          },
          default: { $ref: '#/components/responses/Error' },
        },
      },
      post: {
        tags: ['orders'],
        operationId: 'createOrder',
        requestBody: { $ref: '#/components/requestBodies/NewOrder' },
        responses: {
          201: { $ref: '#/components/responses/OrderCreated' },
          default: { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/orders/{orderId}': {
      parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
      get: {
        tags: ['orders'],
        operationId: 'getOrder',
        responses: {
          200: {
            description: 'The order',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Order' } },
              'application/vnd.retail.order-summary+json': { schema: { $ref: '#/components/schemas/OrderSummary' } },
            },
          },
          default: { $ref: '#/components/responses/Error' },
        },
      },
      patch: {
        tags: ['orders'],
        operationId: 'updateOrder',
        requestBody: { content: { 'application/merge-patch+json': { schema: { $ref: '#/components/schemas/OrderPatch' } } } },
        responses: {
          200: { description: 'The updated order', content: json({ $ref: '#/components/schemas/Order' }) },
          default: { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/orders/{orderId}/shipping-address': {
      put: {
        tags: ['orders'],
        operationId: 'replaceShippingAddress',
        requestBody: { content: json({ $ref: '#/components/schemas/Order/properties/shipping_address' }) },
        responses: { 204: { description: 'Address replaced' } },
      },
    },
    '/orders/{orderId}/notes': {
      post: {
        tags: ['orders'],
        operationId: 'addOrderNote',
        requestBody: {
          content: json({
            type: 'object',
            required: ['note_text'],
            properties: { note_text: { type: 'string', maxLength: 500 }, authorId: { type: 'string' } },
          }),
        },
        responses: {
          201: {
            description: 'The created note',
            content: json({ $ref: '#/paths/~1orders~1{orderId}~1notes/post/requestBody/content/application~1json/schema' }),
          },
        },
      },
    },
    '/categories': {
      get: {
        tags: ['categories'],
        operationId: 'getCategoryTree',
        responses: { 200: { description: 'The category tree', content: json({ $ref: '#/components/schemas/Category' }) } },
      },
    },
    '/legacy-orders': {
      post: {
        tags: ['orders'],
        operationId: 'importLegacyOrder',
        requestBody: { content: json({ $ref: '#/components/schemas/LegacyOrder' }) },
        responses: {
          200: { description: 'Audit trail of the import', content: json({ $ref: './models/shared.yaml#/components/schemas/Audit' }) },
          400: { description: 'Unknown legacy format', content: json({ $ref: '#/components/schemas/Missing' }) },
        },
      },
    },
  },
  components: {
    schemas: {
      Order: {
        type: 'object',
        required: ['order_id', 'status'],
        properties: {
          order_id: { type: 'string', format: 'uuid' },
          status: { $ref: '#/components/schemas/OrderStatus' },
          Order_Status_Reason: { $ref: '#/components/schemas/OrderStatus' },
          billing_address: { $ref: '#/components/schemas/Address' },
          shipping_address: { $ref: '#/components/schemas/Address' },
          lines: { type: 'array', items: { $ref: '#/components/schemas/OrderLine' } },
          totals: {
            allOf: [
              { $ref: '#/components/schemas/Money' },
              { type: 'object', properties: { tax_amount: { type: 'number', format: 'double' } } },
            ],
          },
          metadata: { type: 'object', additionalProperties: { $ref: '#/components/schemas/MetadataValue' } },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      OrderStatus: { type: 'string', enum: ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED'] },
      OrderSummary: { $ref: '#/components/schemas/Money', properties: { ignored_sibling: { type: 'string' } } },
      Address: {
        type: 'object',
        properties: {
          street_line: { type: 'string' },
          city: { type: 'string' },
          postalCode: { type: 'string' },
          country_code: { type: 'string', minLength: 2, maxLength: 2 },
        },
      },
      OrderLine: {
        type: 'object',
        properties: {
          sku: { type: 'string' },
          unit_price: { $ref: '#/components/schemas/Money' },
          quantity: { type: 'integer', minimum: 1 },
        },
      },
      Money: {
        type: 'object',
        properties: { amount: { type: 'number', format: 'double' }, currency_code: { type: 'string' } },
      },
      MetadataValue: { type: 'object', properties: { value_type: { type: 'string' }, value: { type: 'string' } } },
      OrderPatch: {
        type: 'object',
        properties: { status: { $ref: '#/components/schemas/OrderStatus' }, cancel_reason: { type: 'string' } },
      },
      OrderInput: {
        type: 'object',
        required: ['customerId', 'lines'],
        properties: {
          customerId: { type: 'string' },
          lines: { type: 'array', items: { $ref: '#/components/schemas/OrderLine' } },
          delivery_notes: { type: 'string' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          sub_categories: { type: 'array', items: { $ref: '#/components/schemas/Category' } },
          parent: { $ref: '#/components/schemas/Category' },
        },
      },
      LegacyOrder: { $ref: '#/components/schemas/OrderV1' },
      OrderV1: { $ref: '#/components/schemas/OrderV2' },
      OrderV2: { type: 'object', properties: { legacy_ref: { type: 'string' }, channel: { type: 'string' } } },
      Paging: { type: 'object', properties: { total_items: { type: 'integer' }, nextCursor: { type: 'string' } } },
      Problem: { type: 'object', properties: { error_code: { type: 'string' }, detail: { type: 'string' } } },
      SearchFilter: { type: 'object', properties: { search_term: { type: 'string' } } },
      UnusedReport: { type: 'object', properties: { unused_field: { type: 'string' } } },
    },
    parameters: {
      searchFilter: { name: 'search', in: 'query', content: json({ $ref: '#/components/schemas/SearchFilter' }) },
    },
    requestBodies: {
      NewOrder: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/OrderInput' } },
          'application/xml': { schema: { $ref: '#/components/schemas/OrderInput' } },
        },
      },
      UnusedBody: { content: json({ type: 'object', properties: { unused_body_field: { type: 'string' } } }) },
    },
    responses: {
      OrderCreated: {
        description: 'The created order',
        headers: { Location: { schema: { type: 'string', format: 'uri' } } },
        content: json({ $ref: '#/components/schemas/Order' }),
      },
      Error: { description: 'Error', content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/Problem' } } } },
      UnusedResponse: { description: 'Unused', content: json({ type: 'object', properties: { unused_response_field: { type: 'string' } } }) },
    },
  },
};
