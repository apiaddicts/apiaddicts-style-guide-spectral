module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/invoices": {
      "get": {
        "parameters": [
          { "name": "$orderby", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": { "206": { "description": "ok" } }
      }
    },
    "/users/{id}/orders": {
      "get": {
        "parameters": [
          { "name": "$orderby", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": { "206": { "description": "subcollection ok" } }
      }
    },
    "/reports": {
      "get": {
        "responses": { "200": { "description": "no pagination ok" } }
      }
    },
    "/users/me": {
      "get": {
        "responses": { "206": { "description": "ignored correctly" } }
      }
    },
    "/users/{id}": {
      "get": {
        "responses": { "200": { "description": "ignored correctly" } }
      }
    }
  }
};