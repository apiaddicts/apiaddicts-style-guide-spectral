module.exports = {
  "openapi": "3.0.0",
  "info": { "version": "1.0.0", "title": "Swagger Petstore" },
  "paths": {
    "/pets": {
      "get": {
        "responses": { "200": { "description": "OK" } }
      }
    },
    "/orders": {
      "get": {
        "parameters": [
          { "name": "$select", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": { "200": { "description": "OK" } }
      }
    }
  }
};
