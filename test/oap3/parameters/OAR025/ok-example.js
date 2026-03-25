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
          { "name": "$limit", "in": "query", "schema": { "type": "integer" } }
        ],
        "responses": { "206": { "description": "ok pagination" } }
      }
    },
    "/users/{id}/orders": {
      "get": {
        "parameters": [
          { "name": "$limit", "in": "query", "schema": { "type": "integer" } }
        ],
        "responses": { "206": { "description": "subcollection ok" } }
      }
    },
    "/reports": {
      "get": {
        "responses": { "200": { "description": "no pagination ok" } }
      }
    },
    "/users/{id}": {
      "get": {
        "responses": { "200": { "description": "ignored" } }
      }
    }
  }
};