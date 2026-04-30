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
          "200": {
            "description": "OK",
            "content": { "application/json": { "schema": { "type": "object" } } }
          },
          "default": {
            "description": "Unexpected error",
            "content": { "application/json": { "schema": { "type": "object" } } }
          }
        }
      },
      "post": {
        "requestBody": {
          "content": { "application/json": { "schema": { "type": "object" } } }
        },
        "responses": {
          "201": { "description": "Created" },
          "default": {
            "description": "Unexpected error",
            "content": { "application/json": { "schema": { "type": "object" } } }
          }
        }
      }
    },
    "/pets/{id}": {
      "get": {
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": { "description": "OK" },
          "404": { "description": "Not found" },
          "default": {
            "description": "Unexpected error",
            "content": { "application/json": { "schema": { "type": "object" } } }
          }
        }
      },
      "put": {
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "requestBody": {
          "content": { "application/json": { "schema": { "type": "object" } } }
        },
        "responses": {
          "200": { "description": "OK" },
          "default": {
            "description": "Unexpected error",
            "content": { "application/json": { "schema": { "type": "object" } } }
          }
        }
      },
      "delete": {
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "204": { "description": "Deleted" },
          "default": {
            "description": "Unexpected error",
            "content": { "application/json": { "schema": { "type": "object" } } }
          }
        }
      }
    }
  }
};
