module.exports = {
  "swagger": "2.0",
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
            "schema": { "type": "object" }
          },
          "400": { "description": "Bad request" }
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
          "201": { "description": "Created" }
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
          "404": { "description": "Not found" }
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
          "204": { "description": "Deleted" }
        }
      }
    }
  }
};
