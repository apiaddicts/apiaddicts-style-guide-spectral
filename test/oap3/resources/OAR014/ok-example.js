module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "200": { "description": "ok depth 1" }
        }
      }
    },
    "/pets/{petId}": {
      "get": {
        "responses": {
          "200": { "description": "ok depth 2" }
        }
      }
    },
    "/pets/{petId}/owners": {
      "get": {
        "responses": {
          "200": { "description": "ok depth 3" }
        }
      }
    },
    "/users/me/orders": {
      "get": {
        "responses": {
          "200": { "description": "ok ignoring me" }
        }
      }
    }
  }
};