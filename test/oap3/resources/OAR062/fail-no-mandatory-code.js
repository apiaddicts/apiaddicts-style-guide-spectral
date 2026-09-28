module.exports = {
  "openapi": "3.0.0",
  "info": { "version": "1.0.0", "title": "Swagger Petstore" },
  "paths": {
    "/pets": {
      "post": {
        "requestBody": {
          "content": { "application/json": { "schema": { "type": "object" } } }
        },
        "responses": {
          "500": { "description": "Server error", "content": { "application/json": { "schema": { "type": "object" } } } }
        }
      }
    }
  }
};
