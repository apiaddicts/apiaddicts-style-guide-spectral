module.exports = {
  "openapi": "3.2.0",
  "info": {
    "title": "Order History API",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://api.example.com/orders/v1"
    }
  ],
  "$self": "https://specs.example.com/order-history.yaml",
  "paths": {
    "/customers/{customerId}/orderHistory": {
      "$ref": "#/components/pathItems/order-history"
    },
    "/customers/{customerId}/order-exports": {
      "$ref": "#/components/pathItems/OrderExports"
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
  "components": {
    "schemas": {
      "Envelope": {
        "type": "object",
        "properties": {
          "data": {
            "type": [
              "object",
              "null"
            ]
          }
        }
      }
    },
    "pathItems": {
      "order-history": {
        "$ref": "#/components/pathItems/Order_History_V2"
      },
      "Order_History_V2": {
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
        },
        "additionalOperations": {
          "PURGE": {
            "operationId": "purgeOrderHistory",
            "responses": {
              "204": {
                "description": "Purged"
              }
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
    }
  }
};
