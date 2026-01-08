module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "security": [
    { "bearerAuth": [] }
  ],
  "paths": {
    "/invoices": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      },
      "post": {
        "security": [
          { "oauth2": ["write"] }
        ],
        "responses": {
          "201": { "description": "Created" }
        }
      }
    },
    "/payments": {
      "put": {
        "responses": {
          "200": { "description": "Updated" }
        }
      }
    },
    "/reports": {
      "delete": {
        "security": [
          { "bearerAuth": [] }
        ],
        "responses": {
          "204": { "description": "Deleted" }
        }
      }
    }
  }
};