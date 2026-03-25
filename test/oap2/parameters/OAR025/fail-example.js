module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/orders": {
      "get": {
        "responses": { "206": { "description": "missing limit" } }
      }
    },
    "/customers": {
      "get": {
        "parameters": [],
        "responses": { "206": { "description": "empty params" } }
      }
    },
    "/users/{id}/orders": {
      "get": {
        "responses": { "206": { "description": "subcollection missing limit" } }
      }
    }
  }
};