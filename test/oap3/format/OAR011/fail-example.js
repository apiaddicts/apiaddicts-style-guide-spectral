module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "servers": [
    {
      "url": "https://api.example.com/diversosBackend/v1",
      "description": "camelCase base path"
    },
    {
      "url": "https://api.example.com/DiversosBackend/v1",
      "description": "PascalCase base path"
    },
    {
      "url": "https://api.example.com/diversos_backend/v1",
      "description": "underscore base path"
    },
    {
      "url": "https://api.example.com/diversosBackend/servicesInternal",
      "description": "multiple camelCase segments"
    },
    {
      "url": "https://api.example.com/UserProfile/v2",
      "description": "PascalCase resource"
    }
  ],
  "paths": {
    "/userProfile": {
      "get": {
        "responses": {
          "200": { "description": "invalid camelCase path" }
        }
      }
    },
    "/UserProfile": {
      "get": {
        "responses": {
          "200": { "description": "invalid PascalCase path" }
        }
      }
    },
    "/user_profile": {
      "get": {
        "responses": {
          "200": { "description": "invalid underscore path" }
        }
      }
    },
    "/userProfile/orders": {
      "get": {
        "responses": {
          "200": { "description": "camelCase segment" }
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
    "/orders/{userId}/userProfile": {
      "get": {
        "responses": {
          "200": { "description": "invalid segment after param" }
        }
      }
    },
    "/Orders/{userId}/details": {
      "get": {
        "responses": {
          "200": { "description": "PascalCase first segment" }
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