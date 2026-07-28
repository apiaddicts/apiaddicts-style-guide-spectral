module.exports = {
  "openapi": "3.0.0",
  "info": { "version": "1.0.0", "title": "Swagger Petstore" },
  "paths": {
    "/pets": {
      "get": {
        "parameters": [
          { "name": "$exclude", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": { "200": { "description": "OK" } }
      }
    },
    "/pets/{petId}": {
      "get": {
        "parameters": [
          { "name": "petId", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": { "200": { "description": "OK" } }
      }
    },
    "/status": {
      "get": {
        "responses": { "200": { "description": "OK" } }
      }
    },
    "/users/me": {
      "get": {
        "responses": { "200": { "description": "OK" } }
      }
    }
  }
};
