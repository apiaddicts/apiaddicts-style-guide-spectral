module.exports = {
  "openapi": "3.2.0",
  "$self": "https://specs.example.com/Notification_Hub/OpenAPI.yaml",
  "info": {
    "title": "Notification Hub API",
    "version": "2.0.0"
  },
  "servers": [
    {
      "url": "https://api.example.com",
      "name": "Production_EU"
    }
  ],
  "paths": {
    "/{tenantId}": {
      "get": {
        "operationId": "getTenant",
        "summary": "Get tenant",
        "parameters": [
          {
            "name": "tenantId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Get tenant",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      },
      "additionalOperations": {
        "Purge_Cache": {
          "operationId": "purgeCache",
          "responses": {
            "204": {
              "description": "Purged"
            }
          }
        }
      }
    },
    "x-Routing_Table": {
      "region": "eu"
    }
  },
  "webhooks": {
    "Message_Delivered": {
      "post": {
        "operationId": "messageDelivered",
        "summary": "Message delivered",
        "responses": {
          "200": {
            "description": "Message delivered",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Envelope"
                }
              }
            }
          },
          "default": {
            "description": "Unexpected error"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Envelope": {
        "type": "object",
        "properties": {
          "data": {
            "type": [
              "object",
              "null"
            ]
          }
        }
      }
    }
  }
};
