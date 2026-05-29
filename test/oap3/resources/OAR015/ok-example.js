module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/users": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/users/{id}": {
      "get": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/users/{id}/orders": {
      "get": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/users/{id}/orders/{orderId}/items": {
      "get": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "schema": { "type": "string" } },
          { "in": "path", "name": "orderId", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/a/b/c/d/e": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/users/{userId}/orders/{orderId}/items/{itemId}/details": {
      "get": {
        "parameters": [
          { "in": "path", "name": "userId", "required": true, "schema": { "type": "string" } },
          { "in": "path", "name": "orderId", "required": true, "schema": { "type": "string" } },
          { "in": "path", "name": "itemId", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "OK: 4 literal segments (params excluded) <= 5" }
        }
      }
    }
  }
};
