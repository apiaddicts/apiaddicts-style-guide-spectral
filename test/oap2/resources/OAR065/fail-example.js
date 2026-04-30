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
          "201": { "description": "Created (not valid for DELETE)" },
          "400": { "description": "Bad request" }
        }
      }
    },
    "/orders/{id}": {
      "delete": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "type": "string" }
        ],
        "responses": {
          "206": { "description": "Partial (not valid for DELETE)" },
          "400": { "description": "Bad request" }
        }
      }
    }
  }
};
