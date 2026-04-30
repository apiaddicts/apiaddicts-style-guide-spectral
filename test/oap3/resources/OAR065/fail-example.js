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
          "201": { "description": "Created (not valid for DELETE)", "content": { "application/json": { "schema": { "type": "object" } } } },
          "400": { "description": "Bad request" }
        }
      }
    },
    "/orders/{id}": {
      "delete": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "206": { "description": "Partial (not valid for DELETE)", "content": { "application/json": { "schema": { "type": "object" } } } },
          "400": { "description": "Bad request" }
        }
      }
    }
  }
};
