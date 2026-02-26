module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/failAll": {
      "get": {
        "parameters": [
          {
            "in": "query",
            "name": "limit",
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "No example",
            "schema": {
              "type": "object",
              "properties": {
                "id": { "type": "integer" },
                "nested": {
                  "type": "object",
                  "properties": {
                    "value": { "type": "string" }
                  }
                },
                "items": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "400": {
            "$ref": "#/responses/ErrorResponse"
          },
          "default": {
            "description": "Default error",
            "schema": {
              "type": "object"
            }
          }
        }
      }
    }

  },
  "responses": {
    "ErrorResponse": {
      "description": "Error",
      "schema": {
        "type": "object",
        "properties": {
          "message": { "type": "string" }
        }
      }
    }
  }
};