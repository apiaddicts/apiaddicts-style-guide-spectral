module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/examples": {
      "get": {
        "parameters": [
          { "name": "q", "in": "query", "type": "string", "format": "password" }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    },
    "/users": {
      "get": {
        "parameters": [
          { "name": "pwd", "in": "query", "type": "string", "format": "password" }
        ],
        "responses": { "200": { "description": "out of scope (not /examples), ignored" } }
      }
    }
  }
};
