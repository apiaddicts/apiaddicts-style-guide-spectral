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
            "description": "A list of pets."
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
          "201": {
            "description": "Pet created."
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
          "200": { "description": "A single pet." }
        }
      },
      "put": {
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "type": "string"
          },
          {
            "in": "body",
            "name": "body",
            "schema": { "type": "object" }
          }
        ],
        "responses": {
          "200": { "description": "Pet updated." }
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
          "204": { "description": "Pet deleted." }
        }
      }
    }
  }
};
