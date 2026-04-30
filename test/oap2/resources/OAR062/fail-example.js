module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets": {
      "post": {
        "parameters": [{ "in": "body", "name": "body", "schema": { "type": "object" } }],
        "responses": {
          "400": { "description": "Bad request" },
          "500": { "description": "Server error" }
        }
      }
    },
    "/orders": {
      "post": {
        "parameters": [{ "in": "body", "name": "body", "schema": { "type": "object" } }],
        "responses": {
          "400": { "description": "Bad request" },
          "415": { "description": "Unsupported media type" }
        }
      }
    }
  }
};
