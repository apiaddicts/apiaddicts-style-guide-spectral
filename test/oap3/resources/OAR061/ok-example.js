module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "200": { "description": "OK", "content": { "application/json": { "schema": { "type": "object" } } } },
          "400": { "description": "Bad request" },
          "500": { "description": "Server error" }
        }
      }
    },
    "/orders": {
      "get": {
        "responses": {
          "202": { "description": "Accepted", "content": { "application/json": { "schema": { "type": "object" } } } },
          "400": { "description": "Bad request" }
        }
      }
    },
    "/status": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
