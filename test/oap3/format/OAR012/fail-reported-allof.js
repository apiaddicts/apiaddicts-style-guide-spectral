module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Health Status API",
    "version": "1.0.0"
  },
  "paths": {
    "/status": {
      "get": {
        "operationId": "get_status",
        "summary": "Health status",
        "responses": {
          "200": {
            "$ref": "#/components/responses/getStatusResponse"
          },
          "default": {
            "$ref": "#/components/responses/error_response"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "standard_response": {
        "type": "object",
        "properties": {
          "result": {
            "type": "object",
            "properties": {
              "status": {
                "type": "boolean"
              },
              "http_code": {
                "type": "integer"
              }
            }
          },
          "created_at": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "status_data": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "enum": [
              "UP",
              "DOWN"
            ]
          },
          "uptime_seconds": {
            "type": "integer"
          }
        }
      }
    },
    "responses": {
      "getStatusResponse": {
        "description": "Health status of the API.",
        "content": {
          "application/json": {
            "schema": {
              "allOf": [
                {
                  "$ref": "#/components/schemas/standard_response"
                },
                {
                  "type": "object",
                  "properties": {
                    "dataId": {
                      "$ref": "#/components/schemas/status_data"
                    }
                  }
                }
              ]
            },
            "examples": {
              "up": {
                "summary": "API working normally",
                "value": {
                  "result": {
                    "status": true,
                    "http_code": 200
                  },
                  "dataId": {
                    "status": "UP"
                  }
                }
              }
            }
          }
        }
      },
      "error_response": {
        "description": "Error",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/standard_response"
            }
          }
        }
      }
    }
  }
};
