module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore Mixed Paths"
  },
  "paths": {
    "/pets": {
      "get": {
        "responses": {
          "200": { "description": "OK", "schema": { "type": "object" } }
        }
      }
    },
    "/orders": {
      "get": {
        "responses": {
          "400": { "description": "Bad request" },
          "500": { "description": "Server error" }
        }
      }
    },
    "/customers": {
      "get": {
        "responses": {
          "202": { "description": "Accepted", "schema": { "type": "object" } }
        }
      }
    }
  }
};
