module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/invoices": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      },
      "post": {
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
      },
      "patch": {
        "responses": {
          "200": { "description": "Patched" }
        }
      }
    },
    "/reports": {
      "delete": {
        "responses": {
          "204": { "description": "Deleted" }
        }
      }
    }
  }
};