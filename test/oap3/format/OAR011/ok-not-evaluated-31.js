module.exports = {
  "openapi": "3.1.0",
  "info": {
    "title": "Notification Hub API",
    "version": "1.0.0",
    "license": {
      "name": "Apache 2.0",
      "url": "https://www.apache.org/Licenses/LICENSE-2.0.html"
    }
  },
  "externalDocs": {
    "url": "https://docs.example.com/Notification_Hub/Guide.html"
  },
  "servers": [
    {
      "url": "{baseUrl}",
      "variables": {
        "baseUrl": {
          "default": "https://api.example.com/Notification_Hub"
        }
      }
    }
  ],
  "paths": {
    "/{tenantId}": {
      "post": {
        "operationId": "subscribe",
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
        "callbacks": {
          "onDelivery": {
            "{$request.body#/Callback_Url}/Delivery_Status": {
              "post": {
                "operationId": "deliveryStatus",
                "summary": "Delivery status",
                "responses": {
                  "200": {
                    "description": "Delivery status",
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
          }
        },
        "responses": {
          "201": {
            "description": "Subscribed",
            "links": {
              "GetSubscription": {
                "operationId": "subscribe",
                "server": {
                  "url": "https://api.example.com/Subscriptions_V1"
                }
              }
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
      },
      "Notification": {
        "type": "object",
        "properties": {
          "channel": {
            "type": [
              "string",
              "null"
            ]
          },
          "callbackUrl": {
            "type": "string",
            "format": "uri",
            "example": "https://hooks.example.com/My_Hook"
          }
        }
      }
    },
    "pathItems": {
      "Delivery_Status": {
        "get": {
          "operationId": "deliveryStatusItem",
          "summary": "Delivery status item",
          "responses": {
            "200": {
              "description": "Delivery status item",
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
    }
  }
};
