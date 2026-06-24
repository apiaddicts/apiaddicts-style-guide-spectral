module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets": {
      "get": {
        "parameters": [
          { "name": "$expand", "in": "query", "type": "array", "items": { "type": "string" } }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    },
    "/users/{id}": {
      "get": {
        "responses": { "200": { "description": "single resource excluded correctly" } }
      }
    },
    "/users/me": {
      "get": {
        "responses": { "200": { "description": "me endpoint excluded correctly" } }
      }
    },
    "/status": {
      "get": {
        "responses": { "200": { "description": "health check excluded correctly" } }
      }
    }
  }
};
