module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "My API"
  },
  "paths": {
    "/items": {
      "get": {
        "summary": "Get a list of items",
        "parameters": [
          {
            "name": "minOnly",
            "in": "query",
            "schema": {
              "type": "integer",
              "minimum": 0
            }
          },
          {
            "name": "maxOnly",
            "in": "query",
            "schema": {
              "type": "integer",
              "maximum": 100
            }
          },
          {
            "name": "noRestriction",
            "in": "query",
            "schema": {
              "type": "number"
            }
          },
          {
            "name": "minAndFormat",
            "in": "query",
            "schema": {
              "type": "integer",
              "minimum": 0,
              "format": "int32"
            }
          },
          {
            "name": "maxAndFormat",
            "in": "query",
            "schema": {
              "type": "number",
              "maximum": 100,
              "format": "float"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "A list of items"
          }
        }
      }
    }
  }
};
