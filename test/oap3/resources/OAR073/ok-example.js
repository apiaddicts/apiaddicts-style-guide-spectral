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
          "429": { "description": "Too many requests" },
          "500": { "description": "Server error" }
        }
      },
      "post": {
        "requestBody": {
          "content": { "application/json": { "schema": { "type": "object" } } }
        },
        "responses": {
          "201": { "description": "Created" },
          "400": { "description": "Bad request" },
          "429": { "description": "Too many requests" }
        }
      }
    },
    "/users/{id}": {
      "get": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "OK" },
          "404": { "description": "Not found" },
          "429": { "description": "Too many requests" }
        }
      }
    },
    "/status": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/health": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/ping": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
