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
          "400": { "description": "Bad request", "content": { "application/json": { "schema": { "type": "object" } } } },
          "500": { "description": "Server error", "content": { "application/json": { "schema": { "type": "object" } } } }
        }
      }
    },
    "/orders": {
      "get": {
        "responses": {
          "201": { "description": "Created", "content": { "application/json": { "schema": { "type": "object" } } } },
          "404": { "description": "Not found", "content": { "application/json": { "schema": { "type": "object" } } } }
        }
      }
    },
    "/products": {
      "get": {
        "responses": {
          "204": { "description": "No content" }
        }
      }
    }
  }
};
