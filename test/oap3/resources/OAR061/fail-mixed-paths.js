module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore Mixed Paths"
  },
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "200": { "description": "OK", "content": { "application/json": { "schema": { "type": "object" } } } }
        }
      }
    },
    "/orders": {
      "get": {
        "responses": {
          "400": { "description": "Bad request", "content": { "application/json": { "schema": { "type": "object" } } } },
          "500": { "description": "Server error", "content": { "application/json": { "schema": { "type": "object" } } } }
        }
      }
    },
    "/customers": {
      "get": {
        "responses": {
          "202": { "description": "Accepted", "content": { "application/json": { "schema": { "type": "object" } } } }
        }
      }
    }
  }
};
