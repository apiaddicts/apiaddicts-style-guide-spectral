module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/orders": {
      "get": {
        "parameters": [
          { "name": "$limit", "in": "query", "type": "integer", "schema": { "type": "integer" } }
        ],
        "responses": { "206": { "description": "ok pagination" } }
      }
    },
    "/users/{id}/orders": {
      "get": {
        "parameters": [
          { "name": "$limit", "in": "query", "type": "integer", "schema": { "type": "integer" } }
        ],
        "responses": { "206": { "description": "ok subcollection" } }
      }
    },
    "/customers": {
      "get": {
        "responses": { "200": { "description": "no pagination ok" } }
      }
    },
    "/users/me": {
      "get": {
        "responses": { "206": { "description": "me endpoint ignored correctly" } }
      }
    },
    "/users/{id}": {
      "get": {
        "responses": { "206": { "description": "single resource with 206 ignored correctly" } }
      }
    }
  }
};