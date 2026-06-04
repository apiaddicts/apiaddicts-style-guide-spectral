module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets/{id}": {
      "put": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }
        ],
        "requestBody": {
          "content": { "application/json": { "schema": { "type": "object" } } }
        },
        "responses": {
          "201": { "description": "Created (not valid for PUT)", "content": { "application/json": { "schema": { "type": "object" } } } },
          "400": { "description": "Bad request" }
        }
      }
    },
    "/orders/{id}": {
      "put": {
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
