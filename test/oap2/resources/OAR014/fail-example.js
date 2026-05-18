module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/users/accounts/orders/items": {
      "get": {
        "responses": { "200": { "description": "fail depth 4" } }
      }
    },
    "/products/catalog/items/details": {
      "get": {
        "responses": { "200": { "description": "fail depth 4" } }
      }
    },
    "/a/b/c/d/e": {
      "get": {
        "responses": { "200": { "description": "fail depth 5" } }
      }
    }
  }
};