module.exports = {
  "swagger": "2.0",
  "info": { "version": "1.0.0", "title": "Swagger Petstore" },
  "paths": {
    "/pets/{id}": {
      "delete": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "type": "string" }
        ],
        "responses": {
          "204": { "description": "No content" },
          "404": { "description": "Not found" }
        }
      }
    },
    "/orders/{id}": {
      "delete": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "type": "string" }
        ],
        "responses": {
          "200": { "description": "OK", "schema": { "type": "object" } },
          "404": { "description": "Not found" }
        }
      }
    }
  }
};
