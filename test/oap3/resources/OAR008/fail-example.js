module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "200": {
            "description": "A list of pets."
          }
        }
      },
      "post": {
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "type": "object" }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Pet created."
          }
        }
      },
      "head": {
        "responses": {
          "200": {
            "description": "Headers only."
          }
        }
      },
      "options": {
        "responses": {
          "200": {
            "description": "CORS preflight."
          }
        }
      }
    }
  }
};
