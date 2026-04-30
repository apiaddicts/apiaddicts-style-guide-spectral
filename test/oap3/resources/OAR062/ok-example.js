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
          "201": { "description": "Created", "content": { "application/json": { "schema": { "type": "object" } } } },
          "400": { "description": "Bad request" },
          "415": { "description": "Unsupported media type" },
          "500": { "description": "Server error" }
        }
      }
    },
    "/orders": {
      "post": {
        "requestBody": {
          "content": { "application/json": { "schema": { "type": "object" } } }
        },
        "responses": {
          "200": { "description": "OK", "content": { "application/json": { "schema": { "type": "object" } } } },
          "400": { "description": "Bad request" }
        }
      }
    },
    "/batch": {
      "post": {
        "requestBody": {
          "content": { "application/json": { "schema": { "type": "object" } } }
        },
        "responses": {
          "202": { "description": "Accepted" }
        }
      }
    }
  }
};
