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
          "200": { "description": "OK" },
          "400": { "description": "Bad request" },
          "500": { "description": "Error" },
          "503": { "description": "Unavailable" }
        }
      },
      "post": {
        "responses": {
          "201": { "description": "Created" },
          "400": { "description": "Bad request" },
          "415": { "description": "Unsupported media type" },
          "500": { "description": "Error" },
          "503": { "description": "Unavailable" }
        }
      }
    },
    "/users/{userId}": {
      "get": {
        "responses": {
          "200": { "description": "OK" },
          "400": { "description": "Bad request" },
          "404": { "description": "Not found" },
          "500": { "description": "Error" },
          "503": { "description": "Unavailable" }
        }
      },
      "put": {
        "responses": {
          "200": { "description": "Updated" },
          "400": { "description": "Bad request" },
          "404": { "description": "Not found" },
          "415": { "description": "Unsupported media type" },
          "500": { "description": "Error" },
          "503": { "description": "Unavailable" }
        }
      },
      "delete": {
        "responses": {
          "200": { "description": "Deleted" },
          "400": { "description": "Bad request" },
          "404": { "description": "Not found" },
          "500": { "description": "Error" },
          "503": { "description": "Unavailable" }
        }
      },
      "patch": {
        "responses": {
          "200": { "description": "Patched" },
          "400": { "description": "Bad request" },
          "404": { "description": "Not found" },
          "415": { "description": "Unsupported media type" },
          "500": { "description": "Error" },
          "503": { "description": "Unavailable" }
        }
      }
    }
  }
};