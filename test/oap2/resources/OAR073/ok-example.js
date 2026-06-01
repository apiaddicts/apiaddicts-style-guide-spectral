module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "host": "api.example.com",
  "basePath": "/",
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "200": { "description": "OK", "schema": { "type": "object" } },
          "400": { "description": "Bad request" },
          "429": { "description": "Too many requests" },
          "500": { "description": "Server error" }
        }
      },
      "post": {
        "parameters": [{ "in": "body", "name": "body", "schema": { "type": "object" } }],
        "responses": {
          "201": { "description": "Created" },
          "400": { "description": "Bad request" },
          "429": { "description": "Too many requests" }
        }
      }
    },
    "/users/{id}": {
      "get": {
        "parameters": [
          { "in": "path", "name": "id", "required": true, "type": "string" }
        ],
        "responses": {
          "200": { "description": "OK" },
          "404": { "description": "Not found" },
          "429": { "description": "Too many requests" }
        }
      }
    },
    "/status": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/health": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/health-check": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/ping": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/liveness": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/readiness": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
