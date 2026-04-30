module.exports = {
  "swagger": "2.0",
  "info": { "version": "1.0.0", "title": "Swagger Petstore" },
  "paths": {
    "/pets/{id}": {
      "patch": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "type": "string" },
          { "in": "body", "name": "body", "schema": { "type": "object" } }
        ],
        "responses": {
          "201": { "description": "Created (not valid for PATCH)" },
          "400": { "description": "Bad request" }
        }
      }
    },
    "/orders/{id}": {
      "patch": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "type": "string" },
          { "in": "body", "name": "body", "schema": { "type": "object" } }
        ],
        "responses": {
          "400": { "description": "Bad request" },
          "500": { "description": "Server error" }
        }
      }
    }
  }
};
