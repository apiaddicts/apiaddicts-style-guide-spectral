module.exports = {
  "openapi": "3.0.1",
  "info": {
    "title": "Swagger Petstore",
    "version": "1.0.0"
  },
  "paths": {
    "/me/items/{itemId}": {
      "get": {
        "parameters": [
          {
            "name": "itemId",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          }
        ],
        "responses": { "200": { "description": "Ok" } }
      }
    },
    "/customers/{customerId}/invoices": {
      "get": {
        "parameters": [
          {
            "name": "customerId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Ok"
          }
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
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Ok"
          }
        }
      }
    },
    "/orders/delete": {
      "post": {
        "responses": { "200": { "description": "Ok" } }
      }
    },
    "/customers/{customerId}/orders/delete": {
      "post": {
        "parameters": [
          {
            "name": "customerId",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          }
        ],
        "responses": { "200": { "description": "Ok" } }
      }
    },
    "/orders/{orderId}/delete": {
      "post": {
        "parameters": [
          {
            "name": "orderId",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          }
        ],
        "responses": { "200": { "description": "Ok" } }
      }
    }
  }
};
