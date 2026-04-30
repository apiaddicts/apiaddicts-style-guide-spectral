module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "400": { "description": "Bad request" },
          "500": { "description": "Server error" }
        }
      }
    },
    "/orders": {
      "get": {
        "responses": {
          "201": { "description": "Created" },
          "404": { "description": "Not found" }
        }
      }
    },
    "/products": {
      "get": {
        "responses": {
          "204": { "description": "No content" }
        }
      }
    }
  }
};
