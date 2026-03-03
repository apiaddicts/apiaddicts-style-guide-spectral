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
          {
            "name": "inlineQuery",
            "in": "query",
            "schema": { "type": "string" }
          },
          {
            "name": "inlineHeader",
            "in": "header",
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      },
      "post": {
        "parameters": [
          {
            "name": "inlinePath",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          },
          {
            "name": "inlineCookie",
            "in": "cookie",
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      },
      "put": {
        "parameters": [
          {
            "name": "anotherInline",
            "in": "query",
            "schema": { "type": "integer" }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};