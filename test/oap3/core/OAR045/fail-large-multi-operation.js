const okJsonContent = {
  'application/json': {
    schema: {
      type: 'object',
    },
  },
};

module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Storefront API',
  },
  paths: {
    '/products': {
      get: {
        summary: 'List products',
        responses: {
          200: {
            description: 'A page of products',
            content: okJsonContent,
          },
          400: {
            description: 'Invalid query parameters',
          },
        },
      },
      post: {
        summary: 'Create a product',
        responses: {
          201: {
            description: 'Product created',
            content: {},
          },
          400: {
            description: 'Invalid product payload',
            content: okJsonContent,
          },
        },
      },
    },
    '/products/{productId}': {
      get: {
        summary: 'Get a product',
        parameters: [
          {
            in: 'path', name: 'productId', required: true, schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'The product',
            content: okJsonContent,
          },
          404: {
            description: 'Product not found',
          },
        },
      },
      put: {
        summary: 'Replace a product',
        parameters: [
          {
            in: 'path', name: 'productId', required: true, schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Product replaced',
            content: okJsonContent,
          },
          400: {
            description: 'Invalid product payload',
            content: okJsonContent,
          },
          404: {
            description: 'Product not found',
          },
        },
      },
      delete: {
        summary: 'Delete a product',
        parameters: [
          {
            in: 'path', name: 'productId', required: true, schema: { type: 'string' },
          },
        ],
        responses: {
          204: {
            description: 'Product deleted',
          },
          404: {
            description: 'Product not found',
            content: okJsonContent,
          },
        },
      },
    },
    '/orders': {
      get: {
        summary: 'List orders',
        responses: {
          200: {
            description: 'A page of orders',
            content: okJsonContent,
          },
          400: {
            description: 'Invalid query parameters',
            content: {},
          },
        },
      },
      post: {
        summary: 'Create an order',
        responses: {
          201: {
            description: 'Order created',
            content: okJsonContent,
          },
          400: {
            description: 'Invalid order payload',
          },
        },
      },
    },
    '/orders/{orderId}': {
      get: {
        summary: 'Get an order',
        parameters: [
          {
            in: 'path', name: 'orderId', required: true, schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'The order',
            content: okJsonContent,
          },
          404: {
            description: 'Order not found',
            content: okJsonContent,
          },
        },
      },
      patch: {
        summary: 'Update an order',
        parameters: [
          {
            in: 'path', name: 'orderId', required: true, schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Order updated',
          },
          400: {
            description: 'Invalid order payload',
            content: okJsonContent,
          },
        },
      },
      delete: {
        summary: 'Cancel an order',
        parameters: [
          {
            in: 'path', name: 'orderId', required: true, schema: { type: 'string' },
          },
        ],
        responses: {
          204: {
            description: 'Order cancelled',
          },
          404: {
            description: 'Order not found',
          },
        },
      },
    },
    '/customers': {
      get: {
        summary: 'List customers',
        responses: {
          200: {
            description: 'A page of customers',
            content: okJsonContent,
          },
        },
      },
      post: {
        summary: 'Create a customer',
        responses: {
          201: {
            description: 'Customer created',
            content: okJsonContent,
          },
          400: {
            description: 'Invalid customer payload',
            content: {},
          },
        },
      },
    },
    '/customers/{customerId}/orders': {
      get: {
        summary: 'List orders for a customer',
        parameters: [
          {
            in: 'path', name: 'customerId', required: true, schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'A page of orders for the customer',
            content: okJsonContent,
          },
          404: {
            description: 'Customer not found',
          },
        },
      },
    },
  },
};
