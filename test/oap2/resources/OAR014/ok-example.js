module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/users": {
      "get": { "responses": { "200": { "description": "ok" } } }
    },
    "/users/{id}": {
      "get": { "responses": { "200": { "description": "ok depth 2" } } }
    },
    "/users/{id}/orders": {
      "get": { "responses": { "200": { "description": "ok depth 3" } } }
    },
    "/users/me/orders": {
      "get": { "responses": { "200": { "description": "ok ignoring me" } } }
    },
    "/users/me/orders/{orderId}": {
      "get": { "responses": { "200": { "description": "ok depth ignoring me" } } }
    }
  }
};