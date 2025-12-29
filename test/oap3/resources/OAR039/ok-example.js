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
          "206": { "description": "Partial content" },
          "400": { "description": "Bad request" },
          "500": { "description": "Error" },
          "503": { "description": "Unavailable" }
        }
      },
      "post": {
        "responses": {
          "202": { "description": "Accepted" },
          "400": { "description": "Bad request" },
          "415": { "description": "Unsupported media type" },
          "500": { "description": "Error" },
          "503": { "description": "Unavailable" }
        }
      }
    },
    "/orders/{orderId}": {
      "get": {
        "responses": {
          "200": { "description": "OK" },
          "400": { "description": "Bad request" },
          "404": { "description": "Not found" },
          "500": { "description": "Error" },
          "503": { "description": "Unavailable" }
        }
      },
      "put": {
        "responses": {
          "200": { "description": "Updated" },
          "400": { "description": "Bad request" },
          "404": { "description": "Not found" },
          "415": { "description": "Unsupported media type" },
          "500": { "description": "Error" },
          "503": { "description": "Unavailable" }
        }
      },
      "delete": {
        "responses": {
          "200": { "description": "Deleted" },
          "400": { "description": "Bad request" },
          "404": { "description": "Not found" },
          "500": { "description": "Error" },
          "503": { "description": "Unavailable" }
        }
      },
      "patch": {
        "responses": {
          "200": { "description": "Patched" },
          "400": { "description": "Bad request" },
          "404": { "description": "Not found" },
          "415": { "description": "Unsupported media type" },
          "500": { "description": "Error" },
          "503": { "description": "Unavailable" }
        }
      }
    }
  }
};