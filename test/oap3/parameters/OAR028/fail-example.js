module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/examples": {
      "get": {
        "responses": { "200": { "description": "missing filter" } }
      }
    },
    "/examples/featured": {
      "get": {
        "parameters": [],
        "responses": { "200": { "description": "empty params" } }
      }
    },
    "/catalog/examples": {
      "get": {
        "parameters": [
          { "name": "$limit", "in": "query", "schema": { "type": "integer" } }
        ],
        "responses": { "200": { "description": "wrong param only" } }
      }
    },
    "/examples/archived": {
      "get": {
        "responses": { "200": { "description": "missing filter" } }
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
