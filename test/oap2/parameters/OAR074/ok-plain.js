module.exports = {
  "swagger": "2.0",
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
            "name": "minAndMax",
            "in": "query",
            "type": "integer",
            "minimum": 0,
            "maximum": 100
          },
          {
            "name": "formatOnly",
            "in": "query",
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "minMaxAndFormat",
            "in": "query",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "format": "double"
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
