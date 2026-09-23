module.exports = {
  "swagger": "2.0",
  "info": { "version": "1.0.0", "title": "Swagger Petstore" },
  "paths": {
    "/pets/{id}": {
      "put": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "type": "string" },
          { "in": "body", "name": "body", "schema": { "type": "object" } }
        ],
        "responses": {
          "500": { "description": "Server error" }
        }
      }
    }
  }
};
