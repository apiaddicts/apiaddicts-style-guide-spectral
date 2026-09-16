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
          "200": { "description": "OK", "schema": { "type": "object" } },
          "204": { "description": "No content" },
          "404": { "description": "Not found" }
        }
      }
    }
  }
};
