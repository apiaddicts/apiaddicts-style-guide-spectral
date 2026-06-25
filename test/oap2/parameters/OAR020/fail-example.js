module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets": {
      "get": {
        "responses": { "200": { "description": "missing expand" } }
      }
    },
    "/orders": {
      "get": {
        "parameters": [
          { "name": "$select", "in": "query", "type": "array", "items": { "type": "string" } }
        ],
        "responses": { "200": { "description": "wrong param" } }
      }
    },
    "/users/me": {
      "get": {
        "responses": { "200": { "description": "should be ignored" } }
      }
    },
    "/users/{id}": {
      "get": {
        "responses": { "200": { "description": "single resource ignored" } }
      }
    },
    "/status": {
      "get": {
        "responses": { "200": { "description": "health check ignored" } }
      }
    }
  }
};
