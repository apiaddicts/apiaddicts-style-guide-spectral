module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "host": "api.example.com",
  "basePath": "/diversosBackend",
  "paths": {
    "/userProfile": {
      "get": {
        "responses": {
          "200": { "description": "camelCase path" }
        }
      }
    },
    "/UserProfile": {
      "get": {
        "responses": {
          "200": { "description": "PascalCase path" }
        }
      }
    },
    "/user_profile": {
      "get": {
        "responses": {
          "200": { "description": "underscore path" }
        }
      }
    },
    "/orders/userOrders": {
      "get": {
        "responses": {
          "200": { "description": "camelCase nested segment" }
        }
      }
    },
    "/Orders/{userId}/details": {
      "get": {
        "responses": {
          "200": { "description": "PascalCase segment" }
        }
      }
    },
    "/billing/InternalInvoices": {
      "get": {
        "responses": {
          "200": { "description": "PascalCase segment" }
        }
      }
    },
    "/billing/internal_invoices": {
      "get": {
        "responses": {
          "200": { "description": "underscore segment" }
        }
      }
    }
  }
};