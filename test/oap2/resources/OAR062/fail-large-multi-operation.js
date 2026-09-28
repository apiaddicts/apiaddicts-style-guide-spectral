module.exports = {
  "swagger": "2.0",
  "info": { "version": "1.0.0", "title": "Swagger Petstore" },
  "paths": {
    "/pets": {
      "post": {
        "parameters": [{ "in": "body", "name": "body", "schema": { "type": "object" } }],
        "responses": {
          "201": { "description": "Created" },
          "400": { "description": "Bad request" }
        }
      }
    },
    "/orders": {
      "post": {
        "parameters": [{ "in": "body", "name": "body", "schema": { "type": "object" } }],
        "responses": {
          "200": { "description": "OK" },
          "202": { "description": "Accepted" }
        }
      }
    },
    "/invoices": {
      "post": {
        "parameters": [{ "in": "body", "name": "body", "schema": { "type": "object" } }],
        "responses": {
          "500": { "description": "Server error" }
        }
      }
    },
    "/shipments": {
      "post": {
        "parameters": [{ "in": "body", "name": "body", "schema": { "type": "object" } }],
        "responses": {
          "400": { "description": "Bad request" },
          "415": { "description": "Unsupported media type" }
        }
      }
    },
    "/payments": {
      "post": {
        "parameters": [{ "in": "body", "name": "body", "schema": { "type": "object" } }],
        "responses": {
          "206": { "description": "Partial content" }
        }
      }
    },
    "/refunds": {
      "post": {
        "parameters": [{ "in": "body", "name": "body", "schema": { "type": "object" } }],
        "responses": {
          "404": { "description": "Not found" }
        }
      }
    },
    "/status": {
      "post": {
        "parameters": [{ "in": "body", "name": "body", "schema": { "type": "object" } }],
        "responses": {
          "500": { "description": "Server error" }
        }
      }
    },
    "/reports": {
      "post": {
        "parameters": [{ "in": "body", "name": "body", "schema": { "type": "object" } }],
        "responses": {
          "204": { "description": "No content" }
        }
      }
    }
  }
};
