module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "host": "api.example.com",
  "basePath": "/",
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "200": {
            "description": "OK",
            "schema": { "type": "object" }
          },
          "default": {
            "description": "Unexpected error",
            "schema": { "type": "object" }
          }
        }
      },
      "post": {
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "schema": { "type": "object" }
          }
        ],
        "responses": {
          "201": { "description": "Created" },
          "default": {
            "description": "Unexpected error",
            "schema": { "type": "object" }
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
            "type": "string"
          }
        ],
        "responses": {
          "200": { "description": "OK" },
          "404": { "description": "Not found" },
          "default": {
            "description": "Unexpected error",
            "schema": { "type": "object" }
          }
        }
      },
      "delete": {
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "204": { "description": "Deleted" },
          "default": {
            "description": "Unexpected error",
            "schema": { "type": "object" }
          }
        }
      }
    }
  }
};
