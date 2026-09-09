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
          { "name": "$filter", "in": "query", "type": "string" }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    },
    "/examples/featured": {
      "get": {
        "parameters": [
          { "name": "$filter", "in": "query", "type": "string" }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    },
    "/catalog/examples": {
      "get": {
        "parameters": [
          { "name": "$filter", "in": "query", "type": "string" }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    },
    "/users": {
      "get": {
        "responses": { "200": { "description": "out of scope (not /examples), ignored" } }
      }
    },
    "/examples/{id}": {
      "get": {
        "responses": { "200": { "description": "detail endpoint, ignored" } }
      }
    }
  }
};
