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
          { "name": "$orderby", "in": "query", "type": "string" }
        ],
        "responses": { "206": { "description": "ok" } }
      }
    },
    "/examples/featured": {
      "get": {
        "parameters": [
          { "name": "$orderby", "in": "query", "type": "string" }
        ],
        "responses": { "206": { "description": "ok" } }
      }
    },
    "/catalog/examples": {
      "get": {
        "parameters": [
          { "name": "$orderby", "in": "query", "type": "string" }
        ],
        "responses": { "206": { "description": "ok" } }
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
