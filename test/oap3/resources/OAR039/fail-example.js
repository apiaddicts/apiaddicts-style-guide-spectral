module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/orders": {
      "get": {
        "responses": {
          "400": { "description": "Bad request" }
        }
      },
      "post": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/orders/{orderId}": {
      "put": {
        "responses": {
          "200": { "description": "Updated" },
          "404": { "description": "Not found" }
        }
      },
      "delete": {
        "responses": {
          "200": { "description": "Deleted" },
          "500": { "description": "Error" }
        }
      },
      "patch": {
        "responses": {
          "200": { "description": "Patched" },
          "400": { "description": "Bad request" }
        }
      }
    }
  }
};