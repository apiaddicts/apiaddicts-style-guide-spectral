module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/users": {
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
    "/orders": {
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
    "/products": {
      "delete": {
        "responses": {
          "204": { "description": "Deleted" }
        }
      }
    }
  }
};