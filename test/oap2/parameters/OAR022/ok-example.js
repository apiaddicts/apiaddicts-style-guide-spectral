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
          { "name": "$orderby", "in": "query", "type": "string" }
        ],
        "responses": { "206": { "description": "ok" } }
      }
    },
    "/users/{id}/orders": {
      "get": {
        "parameters": [
          { "name": "$orderby", "in": "query", "type": "string" }
        ],
        "responses": { "206": { "description": "ok subcollection" } }
      }
    },
    "/customers": {
      "get": {
        "responses": { "200": { "description": "no pagination ok" } }
      }
    }
  }
};