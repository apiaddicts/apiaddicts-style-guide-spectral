module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "host": "api.example.com",
  "basePath": "/",
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
          { "in": "path", "name": "id", "required": true, "type": "string" }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/users/{id}/orders/{orderId}/items": {
      "get": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "type": "string" },
          { "in": "path", "name": "orderId", "required": true, "type": "string" }
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
    }
  }
};
