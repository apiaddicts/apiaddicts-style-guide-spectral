module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets/{id}": {
      "get": {
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": { "type": "integer" }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      },
      "delete": {
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": { "type": "integer" }
          }
        ],
        "responses": {
          "204": { "description": "No content" }
        }
      }
    },
    "/products/{productId}": {
      "get": {
        "parameters": [
          {
            "in": "path",
            "name": "productId",
            "required": true,
            "schema": { "type": "number" }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
