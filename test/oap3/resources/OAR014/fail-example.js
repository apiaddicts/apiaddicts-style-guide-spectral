module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/customers/accounts/subscriptions/plans": {
      "get": {
        "responses": {
          "200": { "description": "fail depth 4" }
        }
      }
    },
    "/inventory/products/categories/items": {
      "get": {
        "responses": {
          "200": { "description": "fail depth 4" }
        }
      }
    },
    "/a/b/c/d/e": {
      "get": {
        "responses": {
          "200": { "description": "fail depth 5" }
        }
      }
    },
    "/stores/{storeId}/products/{productId}/reviews": {
      "get": {
        "responses": {
          "200": { "description": "fail deep nesting" }
        }
      }
    }
  }
};