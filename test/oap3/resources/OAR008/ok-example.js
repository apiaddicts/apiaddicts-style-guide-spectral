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
            "description": "A list of pets."
          }
        }
      },
      "post": {
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "type": "object" }
            }
          }
        },
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
            "schema": { "type": "string" }
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
            "schema": { "type": "string" }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "type": "object" }
            }
          }
        },
        "responses": {
          "200": { "description": "Pet updated." }
        }
      },
      "patch": {
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "type": "object" }
            }
          }
        },
        "responses": {
          "200": { "description": "Pet patched." }
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
          "204": { "description": "Pet deleted." }
        }
      }
    }
  }
};
