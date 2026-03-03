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
          { "$ref": "#/parameters/QueryParam" },
          { "$ref": "#/parameters/HeaderParam" }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      },
      "post": {
        "parameters": [
          { "$ref": "#/parameters/PathParam" },
          { "$ref": "#/parameters/FormParam" }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      },
      "put": {
        "parameters": [
          { "$ref": "#/parameters/BodyParam" }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  },
  "parameters": {
    "QueryParam": {
      "name": "q",
      "in": "query",
      "type": "string"
    },
    "HeaderParam": {
      "name": "h",
      "in": "header",
      "type": "string"
    },
    "PathParam": {
      "name": "id",
      "in": "path",
      "required": true,
      "type": "string"
    },
    "FormParam": {
      "name": "form",
      "in": "formData",
      "type": "string"
    },
    "BodyParam": {
      "name": "body",
      "in": "body",
      "schema": { "type": "object" }
    }
  }
};