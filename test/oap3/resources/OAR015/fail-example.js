module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/level1/level2/level3/level4/level5/level6": {
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
          "200": { "description": "OK" }
        }
      }
    }
  }
};
