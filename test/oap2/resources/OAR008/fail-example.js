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
          "200": {
            "description": "A list of pets."
          }
        }
      },
      "post": {
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "schema": { "type": "object" }
          }
        ],
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
      }
    }
  }
};
