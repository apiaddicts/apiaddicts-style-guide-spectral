module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets/{id}": {
      "delete": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "204": { "description": "No content" },
          "400": { "description": "Bad request" },
          "404": { "description": "Not found" }
        }
      }
    },
    "/orders/{id}": {
      "delete": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "OK", "content": { "application/json": { "schema": { "type": "object" } } } },
          "404": { "description": "Not found" }
        }
      }
    }
  }
};
