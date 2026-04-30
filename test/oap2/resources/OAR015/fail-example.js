module.exports = {
  "swagger": "2.0",
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
          { "in": "path", "name": "userId", "required": true, "type": "string" },
          { "in": "path", "name": "orderId", "required": true, "type": "string" },
          { "in": "path", "name": "itemId", "required": true, "type": "string" }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
