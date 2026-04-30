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
      },
      "post": {
        "requestBody": {
          "content": { "application/json": { "schema": { "type": "object" } } }
        },
        "responses": {
          "201": { "description": "Created" },
          "400": { "description": "Bad request" }
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
          "404": { "description": "Not found" }
        }
      },
      "delete": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "204": { "description": "No content" }
        }
      }
    }
  }
};
