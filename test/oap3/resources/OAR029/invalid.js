module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/endpoint": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/successResponse"
                }
              }
            }
          },
          "204": {
            "description": "No content"
          },
          "400": {
            "description": "Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/errorResponse"
                }
              }
            }
          },
          "default": {
            "description": "Unknown"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "successResponse": {
        "type": "object",
        "properties": {
          "payload": {
            "type": "object",
            "properties": {
              "tipos": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          }
        }
      },
      "errorResponse": {
        "type": "object",
        "properties": {
          "error": {
            "type": "object",
            "properties": {
              "code": {
                "type": "integer"
              },
              "message": {
                "type": "integer"
              },
              "details": {
                "type": "integer"
              },
              "httpStatus": {
                "type": "string"
              }
            },
            "required": [
              "code",
              "message",
              "httpStatus"
            ]
          }
        }
      }
    }
  }
};
