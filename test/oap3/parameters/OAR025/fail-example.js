module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "components": {
    "parameters": {
      "LimitString": { "name": "$limit", "in": "query", "schema": { "type": "string" } }
    }
  },
  "paths": {
    "/examples": {
      "get": {
        "responses": { "206": { "description": "missing limit" } }
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
          { "name": "$orderby", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": { "206": { "description": "wrong param only" } }
      }
    },
    "/examples/archived": {
      "get": {
        "responses": { "206": { "description": "missing limit" } }
      }
    },
    "/examples/wrong-type-inline": {
      "get": {
        "parameters": [
          { "name": "$limit", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": { "206": { "description": "present but wrong type (string)" } }
      }
    },
    "/examples/wrong-type-ref": {
      "get": {
        "parameters": [
          { "$ref": "#/components/parameters/LimitString" }
        ],
        "responses": { "206": { "description": "present but wrong type via $ref" } }
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
