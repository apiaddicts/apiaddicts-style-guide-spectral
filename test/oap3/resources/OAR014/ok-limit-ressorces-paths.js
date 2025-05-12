module.exports = {
  "openapi": "3.0.1",
  "info": {
    "title": "Swagger Petstore",
    "version": "1.0"
  },
  "paths": {
    "/customers/{customerId}/invoices": {
      "get": {
        "parameters": [
          {
            "name": "customerId",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/invoices/{invoiceId}": {
      "get": {
        "parameters": [
          {
            "name": "invoiceId",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/invoices/{invoiceId}/products": {
      "get": {
        "parameters": [
          {
            "name": "invoiceId",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
