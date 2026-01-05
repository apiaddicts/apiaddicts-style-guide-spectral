module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/items/{id}": {
      "get": {
        "summary": "Get item by id",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Item"
          },
          "404": {
            "description": "Not Found"
          }
        }
      }
    },
    "/orders": {
      "post": {
        "summary": "Create sub-resource",
        "responses": {
          "201": {
            "description": "Created"
          }
        }
      }
    }
  }
};