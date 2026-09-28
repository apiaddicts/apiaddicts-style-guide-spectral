module.exports = {
  "openapi": "3.0.0",
  "info": { "version": "1.0.0", "title": "Swagger Petstore" },
  "paths": {
    "/pets/{id}": {
      "patch": {
        "parameters": [{ "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }],
        "requestBody": { "content": { "application/json": { "schema": { "type": "object" } } } },
        "responses": {
          "200": { "description": "OK" },
          "400": { "description": "Bad request" }
        }
      }
    },
    "/orders/{id}": {
      "patch": {
        "parameters": [{ "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }],
        "requestBody": { "content": { "application/json": { "schema": { "type": "object" } } } },
        "responses": {
          "202": { "description": "Accepted" },
          "206": { "description": "Partial content" }
        }
      }
    },
    "/invoices/{id}": {
      "patch": {
        "parameters": [{ "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }],
        "requestBody": { "content": { "application/json": { "schema": { "type": "object" } } } },
        "responses": {
          "500": { "description": "Server error" }
        }
      }
    },
    "/shipments/{id}": {
      "patch": {
        "parameters": [{ "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }],
        "requestBody": { "content": { "application/json": { "schema": { "type": "object" } } } },
        "responses": {
          "400": { "description": "Bad request" },
          "415": { "description": "Unsupported media type" }
        }
      }
    },
    "/payments/{id}": {
      "patch": {
        "parameters": [{ "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }],
        "requestBody": { "content": { "application/json": { "schema": { "type": "object" } } } },
        "responses": {
          "204": { "description": "No content" }
        }
      }
    },
    "/refunds/{id}": {
      "patch": {
        "parameters": [{ "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }],
        "requestBody": { "content": { "application/json": { "schema": { "type": "object" } } } },
        "responses": {
          "404": { "description": "Not found" }
        }
      }
    },
    "/status": {
      "patch": {
        "requestBody": { "content": { "application/json": { "schema": { "type": "object" } } } },
        "responses": {
          "500": { "description": "Server error" }
        }
      }
    },
    "/reports/{id}": {
      "patch": {
        "parameters": [{ "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }],
        "requestBody": { "content": { "application/json": { "schema": { "type": "object" } } } },
        "responses": {
          "206": { "description": "Partial content" }
        }
      }
    }
  }
};
