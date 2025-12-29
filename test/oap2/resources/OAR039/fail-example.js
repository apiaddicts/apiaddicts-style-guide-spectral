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
          "400": { "description": "Bad request" }
        }
      }
    },
    "/users/{userId}": {
      "get": {
        "responses": {
          "200": { "description": "OK" },
          "500": { "description": "Error" }
        }
      },
      "put": {
        "responses": {
          "200": { "description": "Updated" }
        }
      },
      "delete": {
        "responses": {
          "200": { "description": "Deleted" }
        }
      },
      "patch": {
        "responses": {
          "200": { "description": "Patched" },
          "400": { "description": "Bad request" }
        }
      }
    }
  }
};