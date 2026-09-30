module.exports = {
  "openapi": "3.0.1",
  "info": {
    "title": "Insurance Policy API",
    "version": "1.0.0"
  },
  "paths": {
    "/emails/{emailStore}/last": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EmailReaderResponse"
                }
              }
            }
          },
          "400": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Problem"
                }
              }
            }
          }
        }
      }
    },
    "/emails/{emailStore}/last-content": {
      "get": {
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EmailReaderResponse"
                }
              }
            }
          },
          "default": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Problem"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "EmailReaderResponse": {
        "title": "EmailReaderResponse",
        "type": "object",
        "properties": {
          "attachments": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/EmailReaderAttachmentDto"
            }
          },
          "body": {
            "type": "string"
          },
          "cc": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "from": {
            "type": "string"
          },
          "messageId": {
            "type": "string"
          },
          "receiveDate": {
            "type": "string",
            "format": "date-time"
          },
          "subject": {
            "type": "string"
          },
          "to": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      "EmailReaderAttachmentDto": {
        "type": "object",
        "properties": {
          "content": {
            "type": "string"
          },
          "mimeType": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "size": {
            "type": "integer"
          }
        }
      },
      "Problem": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "errors": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    }
  }
};
