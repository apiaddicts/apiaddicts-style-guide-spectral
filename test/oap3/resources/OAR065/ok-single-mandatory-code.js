module.exports = {
  "openapi": "3.0.0",
  "info": { "version": "1.0.0", "title": "Swagger Petstore" },
  "paths": {
    "/pets/{id}": {
      "delete": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "204": { "description": "No content" },
          "404": { "description": "Not found" }
        }
      }
    }
  }
};
