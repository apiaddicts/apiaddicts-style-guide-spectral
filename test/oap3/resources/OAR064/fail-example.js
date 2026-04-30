module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets/{id}": {
      "patch": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }
        ],
        "requestBody": {
          "content": { "application/json": { "schema": { "type": "object" } } }
        },
        "responses": {
          "201": { "description": "Created (not valid for PATCH)", "content": { "application/json": { "schema": { "type": "object" } } } },
          "400": { "description": "Bad request" }
        }
      }
    },
    "/orders/{id}": {
      "patch": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }
        ],
        "requestBody": {
          "content": { "application/json": { "schema": { "type": "object" } } }
        },
        "responses": {
          "400": { "description": "Bad request" },
          "500": { "description": "Server error" }
        }
      }
    }
  }
};
