module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "host": "api.example.com",
  "basePath": "/diversos-backend",
  "paths": {
    "/users": {
      "get": {
        "responses": {
          "200": { "description": "valid simple path" }
        }
      }
    },
    "/user-profile": {
      "get": {
        "responses": {
          "200": { "description": "kebab-case path" }
        }
      }
    },
    "/user-profile/orders": {
      "get": {
        "responses": {
          "200": { "description": "nested kebab-case" }
        }
      }
    },
    "/orders/{id}": {
      "get": {
        "responses": {
          "200": { "description": "parameter path" }
        }
      }
    },
    "/orders/{id}/order-items": {
      "get": {
        "responses": {
          "200": { "description": "param + kebab-case" }
        }
      }
    },
    "/billing/invoice-items": {
      "get": {
        "responses": {
          "200": { "description": "multi word kebab-case" }
        }
      }
    },
    "/billing/{id}/invoice-items": {
      "get": {
        "responses": {
          "200": { "description": "deep valid nesting" }
        }
      }
    }
  }
};