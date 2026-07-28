module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/invoices": {
      "get": {
        "responses": { "206": { "description": "missing limit" } }
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
        "responses": { "206": { "description": "subcollection missing limit" } }
      }
    },
    "/products": {
      "get": {
        "parameters": [
          { "name": "$orderby", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": { "206": { "description": "wrong param only" } }
      }
    },
    "/users/me": {
      "get": {
        "responses": { "206": { "description": "ignored" } }
      }
    },
    "/users/{id}": {
      "get": {
        "responses": { "206": { "description": "single resource ignored" } }
      }
    }
  }
};