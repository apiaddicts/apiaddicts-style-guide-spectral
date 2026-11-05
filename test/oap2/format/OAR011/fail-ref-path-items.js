module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "Order History API",
    "version": "1.0.0"
  },
  "host": "api.example.com",
  "basePath": "/orders/v1",
  "paths": {
    "/customers/{customerId}/orderHistory": {
      "$ref": "#/x-shared-path-items/order-history"
    },
    "/customers/{customerId}/order-exports": {
      "$ref": "#/x-shared-path-items/OrderExports"
    },
    "/customers/{customerId}/Orders": {
      "get": {
        "operationId": "listCustomerOrders",
        "summary": "List customer orders",
        "parameters": [
          {
            "name": "customerId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "List customer orders",
            "schema": {
              "$ref": "#/definitions/Envelope"
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    }
  },
  "x-shared-path-items": {
    "order-history": {
      "get": {
        "operationId": "listOrderHistory",
        "summary": "List order history",
        "parameters": [
          {
            "name": "customerId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "List order history",
            "schema": {
              "$ref": "#/definitions/Envelope"
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    },
    "OrderExports": {
      "get": {
        "operationId": "listOrderExports",
        "summary": "List order exports",
        "parameters": [
          {
            "name": "customerId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "List order exports",
            "schema": {
              "$ref": "#/definitions/Envelope"
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    }
  },
  "definitions": {
    "Envelope": {
      "type": "object",
      "properties": {
        "data": {
          "type": "object"
        }
      }
    }
  }
};
