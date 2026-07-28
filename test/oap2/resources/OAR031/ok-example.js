module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/validAll": {
      "get": {
        "parameters": [
          {
            "in": "query",
            "name": "limit",
            "type": "integer",
            "example": 10
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "integer",
                  "example": 1
                },
                "nested": {
                  "type": "object",
                  "properties": {
                    "value": {
                      "type": "string",
                      "example": "abc"
                    }
                  }
                },
                "items": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "example": "item1"
                  }
                }
              }
            },
            "examples": {
              "application/json": {
                "id": 1,
                "nested": { "value": "abc" },
                "items": ["item1"]
              }
            }
          },
          "201": {
            "description": "Example via examples",
            "schema": {
              "type": "object"
            },
            "examples": {
              "application/json": {
                "id": 1
              }
            }
          },
          "default": {
            "description": "Default error",
            "schema": {
              "type": "object",
              "example": {
                "message": "error"
              }
            }
          }
        }
      }
    }
  }
};