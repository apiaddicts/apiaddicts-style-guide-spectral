module.exports = {
  "openapi": "3.0.1",
  "info": {
    "title": "Swagger Petstore",
    "version": "1.0.0"
  },
  "paths": {
    "/{one}": {
      "get": {
        "parameters": [
          {
            "name": "one",
            "in": "path",
            "required": true,
            "schema": { "type": "integer" }
          }
        ],
        "responses": { "200": { "description": "Ok" } }
      }
    },
    "/one/two": {
      "get": {
        "responses": { "200": { "description": "Ok" } }
      }
    },
    "/customers/{customerId}/{invoiceId}": {
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
        "responses": { "200": { "description": "Ok" } }
      }
    }
  }
};
