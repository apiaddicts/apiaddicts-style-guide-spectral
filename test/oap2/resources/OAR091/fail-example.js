module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/users": {
      "get": {
        "parameters": [
          {
            "name": "inlineQuery",
            "in": "query",
            "type": "string"
          },
          {
            "name": "inlineHeader",
            "in": "header",
            "type": "string"
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
            "type": "string"
          },
          {
            "name": "inlineForm",
            "in": "formData",
            "type": "string"
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      },
      "put": {
        "parameters": [
          {
            "name": "inlineBody",
            "in": "body",
            "schema": {
              "type": "object"
            }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      },
      "patch": {
        "parameters": [
          {
            "name": "anotherInline",
            "in": "query",
            "type": "integer"
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      },
      "delete": {
        "parameters": [
          {
            "name": "yetAnotherInline",
            "in": "header",
            "type": "string"
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};