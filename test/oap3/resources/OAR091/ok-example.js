module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/orders": {
      "get": {
        "parameters": [
          { "$ref": "#/components/parameters/QueryParam" },
          { "$ref": "#/components/parameters/HeaderParam" }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      },
      "post": {
        "parameters": [
          { "$ref": "#/components/parameters/PathParam" },
          { "$ref": "#/components/parameters/CookieParam" }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  },
  "components": {
    "parameters": {
      "QueryParam": {
        "name": "q",
        "in": "query",
        "schema": { "type": "string" }
      },
      "HeaderParam": {
        "name": "h",
        "in": "header",
        "schema": { "type": "string" }
      },
      "PathParam": {
        "name": "id",
        "in": "path",
        "required": true,
        "schema": { "type": "string" }
      },
      "CookieParam": {
        "name": "c",
        "in": "cookie",
        "schema": { "type": "string" }
      }
    }
  }
};