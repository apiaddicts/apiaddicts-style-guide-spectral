module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets": {
      "post": {
        "requestBody": {
          "content": { "application/json": { "schema": { "type": "object" } } }
        },
        "responses": {
          "400": { "description": "Bad request", "content": { "application/json": { "schema": { "type": "object" } } } },
          "500": { "description": "Server error", "content": { "application/json": { "schema": { "type": "object" } } } }
        }
      }
    },
    "/orders": {
      "post": {
        "requestBody": {
          "content": { "application/json": { "schema": { "type": "object" } } }
        },
        "responses": {
          "400": { "description": "Bad request", "content": { "application/json": { "schema": { "type": "object" } } } },
          "415": { "description": "Unsupported media type", "content": { "application/json": { "schema": { "type": "object" } } } }
        }
      }
    }
  }
};
