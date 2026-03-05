module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "servers": [
    {
      "url": "https://api.example.com/diversos-backend/v1",
      "description": "valid kebab-case base path"
    },
    {
      "url": "https://api.example.com/customer-data/v2",
      "description": "multi word kebab-case"
    },
    {
      "url": "https://api.example.com/order-management/internal-services",
      "description": "multiple valid segments"
    }
  ],
  "paths": {
    "/users": {
      "get": {
        "responses": { "200": { "description": "ok" } }
      }
    },
    "/user-profile": {
      "get": {
        "responses": { "200": { "description": "valid kebab-case" } }
      }
    },
    "/user-profile/orders": {
      "get": {
        "responses": { "200": { "description": "nested kebab-case" } }
      }
    },
    "/orders/{id}": {
      "get": {
        "responses": { "200": { "description": "param allowed" } }
      }
    },
    "/orders/{id}/order-items": {
      "get": {
        "responses": { "200": { "description": "param + kebab-case" } }
      }
    },
    "/billing/invoice-items": {
      "get": {
        "responses": { "200": { "description": "multi-word kebab-case" } }
      }
    },
    "/billing/{id}/invoice-items": {
      "get": {
        "responses": { "200": { "description": "nested valid structure" } }
      }
    }
  }
};