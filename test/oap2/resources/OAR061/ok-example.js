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
          "200": { "description": "OK", "schema": { "type": "object" } },
          "400": { "description": "Bad request" }
        }
      }
    },
    "/orders": {
      "get": {
        "responses": {
          "202": { "description": "Accepted", "schema": { "type": "object" } },
          "400": { "description": "Bad request" }
        }
      }
    },
    "/status": {
      "get": {
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
