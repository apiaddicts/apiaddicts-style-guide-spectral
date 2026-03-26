module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/invoices": {
      "get": {
        "responses": { "206": { "description": "missing orderby" } }
      }
    },
    "/transactions": {
      "get": {
        "parameters": [],
        "responses": { "206": { "description": "empty params" } }
      }
    },
    "/users/{id}/orders": {
      "get": {
        "responses": { "206": { "description": "subcollection missing orderby" } }
      }
    },
    "/products": {
      "get": {
        "parameters": [
          { "name": "$limit", "in": "query", "schema": { "type": "integer" } }
        ],
        "responses": { "206": { "description": "wrong param only" } }
      }
    },
    "/users/me": {
      "get": {
        "responses": { "206": { "description": "should be ignored" } }
      }
    },
    "/users/{id}": {
      "get": {
        "responses": { "206": { "description": "should be ignored" } }
      }
    }
  }
};