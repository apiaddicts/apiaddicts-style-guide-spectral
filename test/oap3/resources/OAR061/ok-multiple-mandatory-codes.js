module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore Multiple Mandatory Codes"
  },
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "200": { "description": "OK", "content": { "application/json": { "schema": { "type": "object" } } } },
          "202": { "description": "Accepted", "content": { "application/json": { "schema": { "type": "object" } } } },
          "206": { "description": "Partial content", "content": { "application/json": { "schema": { "type": "object" } } } }
        }
      }
    }
  }
};
