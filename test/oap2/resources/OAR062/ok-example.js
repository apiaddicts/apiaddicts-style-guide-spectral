module.exports = {
  "swagger": "2.0",
  "info": { "version": "1.0.0", "title": "Swagger Petstore" },
  "paths": {
    "/pets": {
      "post": {
        "parameters": [{ "in": "body", "name": "body", "schema": { "type": "object" } }],
        "responses": {
          "201": { "description": "Created", "schema": { "type": "object" } },
          "400": { "description": "Bad request" }
        }
      }
    },
    "/orders": {
      "post": {
        "parameters": [{ "in": "body", "name": "body", "schema": { "type": "object" } }],
        "responses": {
          "200": { "description": "OK", "schema": { "type": "object" } },
          "400": { "description": "Bad request" }
        }
      }
    }
  }
};
