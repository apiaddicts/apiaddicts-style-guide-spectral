module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "host": "api.example.com",
  "basePath": "/",
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
