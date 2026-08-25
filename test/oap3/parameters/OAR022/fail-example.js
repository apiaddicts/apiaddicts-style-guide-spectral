module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/examples": {
      "get": {
        "responses": { "206": { "description": "missing orderby" } }
      }
    },
    "/examples/featured": {
      "get": {
        "parameters": [],
        "responses": { "206": { "description": "empty params" } }
      }
    },
    "/catalog/examples": {
      "get": {
        "parameters": [
          { "name": "$limit", "in": "query", "schema": { "type": "integer" } }
        ],
        "responses": { "206": { "description": "wrong param only" } }
      }
    },
    "/examples/archived": {
      "get": {
        "responses": { "206": { "description": "missing orderby" } }
      }
    },
    "/examples/not-paginated": {
      "get": {
        "responses": { "200": { "description": "no 206 -> rule does not apply" } }
      }
    },
    "/users": {
      "get": {
        "responses": { "206": { "description": "out of scope (not /examples), ignored" } }
      }
    },
    "/examples/{id}": {
      "get": {
        "responses": { "206": { "description": "detail endpoint, ignored" } }
      }
    }
  }
};
