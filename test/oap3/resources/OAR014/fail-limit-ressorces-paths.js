module.exports = {
  "openapi": "3.0.1",
  "info": {
    "title": "Swagger Petstore",
    "version": "1.0"
  },
  "paths": {
    "/customers/{customerId}/invoices/{invoiceId}": {
      "get": {
        "parameters": [
          {
            "name": "customerId",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          },
          {
            "name": "invoiceId",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          }
        ],
        "responses": {
          "default": { "description": "OK" }
        }
      }
    },
    "/customers/{customerId}/invoices/{invoiceId}/products": {
      "get": {
        "parameters": [
          {
            "name": "customerId",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          },
          {
            "name": "invoiceId",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          }
        ],
        "responses": {
          "default": { "description": "OK" }
        }
      }
    }
  }
};
