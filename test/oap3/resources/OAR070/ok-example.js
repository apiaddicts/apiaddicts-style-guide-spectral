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
            "schema": { "type": "string" }
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
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "204": { "description": "No content" }
        }
      }
    },
    "/users/{userId}/orders/{orderId}": {
      "get": {
        "parameters": [
          {
            "in": "path",
            "name": "userId",
            "required": true,
            "schema": { "type": "string" }
          },
          {
            "in": "path",
            "name": "orderId",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
