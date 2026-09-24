module.exports = {
  "openapi": "3.0.0",
  "info": { "version": "1.0.0", "title": "Swagger Petstore" },
  "paths": {
    "/pets": {
      "post": {
        "requestBody": { "content": { "application/json": { "schema": { "type": "object" } } } },
        "responses": {
          "201": { "description": "Created", "content": { "application/json": { "schema": { "type": "object" } } } },
          "400": { "description": "Bad request" }
        }
      }
    },
    "/orders": {
      "post": {
        "requestBody": { "content": { "application/json": { "schema": { "type": "object" } } } },
        "responses": {
          "200": { "description": "OK", "content": { "application/json": { "schema": { "type": "object" } } } },
          "202": { "description": "Accepted" }
        }
      }
    },
    "/invoices": {
      "post": {
        "requestBody": { "content": { "application/json": { "schema": { "type": "object" } } } },
        "responses": {
          "500": { "description": "Server error" }
        }
      }
    },
    "/shipments": {
      "post": {
        "requestBody": { "content": { "application/json": { "schema": { "type": "object" } } } },
        "responses": {
          "400": { "description": "Bad request" },
          "415": { "description": "Unsupported media type" }
        }
      }
    },
    "/payments": {
      "post": {
        "requestBody": { "content": { "application/json": { "schema": { "type": "object" } } } },
        "responses": {
          "206": { "description": "Partial content" }
        }
      }
    },
    "/refunds": {
      "post": {
        "requestBody": { "content": { "application/json": { "schema": { "type": "object" } } } },
        "responses": {
          "404": { "description": "Not found" }
        }
      }
    },
    "/status": {
      "post": {
        "requestBody": { "content": { "application/json": { "schema": { "type": "object" } } } },
        "responses": {
          "500": { "description": "Server error" }
        }
      }
    },
    "/reports": {
      "post": {
        "requestBody": { "content": { "application/json": { "schema": { "type": "object" } } } },
        "responses": {
          "204": { "description": "No content" }
        }
      }
    }
  }
};
