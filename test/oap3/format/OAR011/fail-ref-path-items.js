module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Order History API",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://api.example.com/orders/v1"
    }
  ],
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
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "List customer orders",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
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
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "List order history",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
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
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "List order exports",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Envelope": {
        "type": "object",
        "properties": {
          "data": {
            "type": "object",
            "nullable": true
          }
        }
      }
    }
  }
};
