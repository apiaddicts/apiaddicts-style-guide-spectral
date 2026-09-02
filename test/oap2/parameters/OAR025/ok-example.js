module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "parameters": {
    "LimitInteger": { "name": "$limit", "in": "query", "type": "integer" }
  },
  "paths": {
    "/examples": {
      "get": {
        "parameters": [
          { "name": "$limit", "in": "query", "type": "integer" }
        ],
        "responses": { "206": { "description": "ok" } }
      }
    },
    "/examples/featured": {
      "get": {
        "parameters": [
          { "name": "$limit", "in": "query", "type": "integer" }
        ],
        "responses": { "206": { "description": "ok" } }
      }
    },
    "/catalog/examples": {
      "get": {
        "parameters": [
          { "name": "$limit", "in": "query", "type": "integer" }
        ],
        "responses": { "206": { "description": "ok" } }
      }
    },
    "/examples/ref-ok": {
      "get": {
        "parameters": [
          { "$ref": "#/parameters/LimitInteger" }
        ],
        "responses": { "206": { "description": "present integer via $ref" } }
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
